import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { canUpload } from "@/lib/uploadAuth";
import {
  clearOverride,
  isKnownPhotoId,
  setOverride,
  sniffImage,
} from "@/lib/photoStore";

const MAX_BYTES = 12 * 1024 * 1024;

type Ctx = { params: Promise<{ id: string }> };

async function guard(id: string) {
  if (!(await canUpload())) {
    return NextResponse.json({ error: "Enter your access code first." }, { status: 401 });
  }
  if (!isKnownPhotoId(id)) {
    return NextResponse.json({ error: "Unknown photo." }, { status: 404 });
  }
  return null;
}

/** Replace a photo with an uploaded image. */
export async function POST(request: Request, { params }: Ctx) {
  const { id } = await params;
  const denied = await guard(id);
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image was sent." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 12 MB or smaller." }, { status: 413 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(data);
  if (!ext) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG or WebP image." },
      { status: 415 }
    );
  }

  const dim = (v: FormDataEntryValue | null) => {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 && n <= 20000 ? n : null;
  };
  const width = dim(form?.get("width") ?? null) ?? 1600;
  const height = dim(form?.get("height") ?? null) ?? 1200;

  const name = `${id}-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  const photo = await setOverride(id, name, data, width, height);
  return NextResponse.json({ photo });
}

/** Restore the original photo. */
export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const denied = await guard(id);
  if (denied) return denied;

  await clearOverride(id);
  return NextResponse.json({ ok: true });
}
