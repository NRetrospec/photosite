import { promises as fs } from "fs";
import path from "path";
import { photos, type PhotoOverrides } from "./photos";

/**
 * Uploaded replacements live on disk (outside /public, so they work at
 * runtime) with a small JSON index mapping photo id -> stored file.
 */
const DIR = path.join(process.cwd(), ".uploads");
const INDEX = path.join(DIR, "overrides.json");

interface StoredOverride {
  file: string;
  width: number;
  height: number;
}

const FILE_RE = /^[a-z0-9]+-[a-z0-9]+-[a-f0-9]{8}\.(jpg|png|webp)$/;
const knownIds = new Set(photos.map((p) => p.id));

export const isKnownPhotoId = (id: string) => knownIds.has(id);
export const isStoredFileName = (name: string) => FILE_RE.test(name);

// Serialise read-modify-write cycles on the index.
let queue: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readIndex(): Promise<Record<string, StoredOverride>> {
  try {
    const raw = JSON.parse(await fs.readFile(INDEX, "utf8"));
    const out: Record<string, StoredOverride> = {};
    for (const [id, v] of Object.entries(raw ?? {})) {
      const o = v as StoredOverride;
      if (knownIds.has(id) && o && FILE_RE.test(o.file)) out[id] = o;
    }
    return out;
  } catch {
    return {};
  }
}

async function writeIndex(index: Record<string, StoredOverride>) {
  await fs.mkdir(DIR, { recursive: true });
  const tmp = `${INDEX}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(index, null, 2));
  await fs.rename(tmp, INDEX);
}

export const fileUrl = (file: string) => `/api/photos/file/${file}`;

export async function readOverrides(): Promise<PhotoOverrides> {
  const index = await readIndex();
  const out: PhotoOverrides = {};
  for (const [id, o] of Object.entries(index)) {
    out[id] = { src: fileUrl(o.file), width: o.width, height: o.height };
  }
  return out;
}

export function setOverride(
  id: string,
  file: string,
  data: Buffer,
  width: number,
  height: number
) {
  return locked(async () => {
    const index = await readIndex();
    const previous = index[id]?.file;
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(path.join(DIR, file), data);
    index[id] = { file, width, height };
    await writeIndex(index);
    if (previous) await fs.rm(path.join(DIR, previous), { force: true });
    return { src: fileUrl(file), width, height };
  });
}

export function clearOverride(id: string) {
  return locked(async () => {
    const index = await readIndex();
    const previous = index[id]?.file;
    if (!previous) return;
    delete index[id];
    await writeIndex(index);
    await fs.rm(path.join(DIR, previous), { force: true });
  });
}

export async function readStoredFile(name: string): Promise<Buffer | null> {
  if (!FILE_RE.test(name)) return null;
  try {
    return await fs.readFile(path.join(DIR, name));
  } catch {
    return null;
  }
}

/** Detect the real image type from magic bytes; never trust the client. */
export function sniffImage(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (
    buf[0] === 0x89 &&
    buf.toString("ascii", 1, 4) === "PNG"
  )
    return "png";
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  return null;
}
