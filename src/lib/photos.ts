export type PhotoCategory =
  | "Weddings"
  | "Portraits"
  | "Editorial"
  | "Cars"
  | "Animals"
  | "Nature";

export const photoCategories: PhotoCategory[] = [
  "Weddings",
  "Portraits",
  "Editorial",
  "Cars",
  "Animals",
  "Nature",
];

export interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  category: PhotoCategory;
  description?: string;
  /** aperture / shutter / iso — camera-metadata flavour text */
  meta?: string;
}

const px = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const heroPhoto: Photo = {
  id: "hero",
  src: px(38892542, 2200),
  width: 7008,
  height: 4672,
  alt: "Bride silhouetted on a theater stage, illuminated dramatically from behind",
  title: "The Last Rehearsal",
  category: "Weddings",
  meta: "ƒ/1.8 · 1/250 · ISO 400",
};

export const portraitOfPhotographer = {
  src: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=1400",
  width: 1400,
  height: 1400,
  alt: "Default placeholder portrait",
};

export const bookingSideImage = {
  src: px(4240289, 1200),
  width: 4000,
  height: 6000,
  alt: "A hand holding a vintage film camera against a black background",
};

export const photos: Photo[] = [
  // ——— Weddings ———
  {
    id: "w1",
    src: px(38892542, 1800),
    width: 7008,
    height: 4672,
    alt: "Bride silhouetted on a theater stage lit from behind",
    title: "The Last Rehearsal",
    category: "Weddings",
    description: "An empty theater, a single light, and a promise about to be made.",
    meta: "ƒ/1.8 · 1/250 · ISO 400",
  },
  {
    id: "w2",
    src: px(35599228, 1200),
    width: 4160,
    height: 6240,
    alt: "Bride in a lace gown ascending a staircase, photographed in black and white",
    title: "Ascension",
    category: "Weddings",
    description: "Three minutes before the ceremony. She never looked back.",
    meta: "ƒ/2.0 · 1/160 · ISO 800",
  },
  {
    id: "w3",
    src: px(21567500, 1600),
    width: 11656,
    height: 8742,
    alt: "Bride softly silhouetted behind a delicate lace veil",
    title: "Through the Veil",
    category: "Weddings",
    description: "Soft light through French lace — the quietest moment of the day.",
    meta: "ƒ/1.4 · 1/500 · ISO 200",
  },
  {
    id: "w4",
    src: px(35536264, 1200),
    width: 4160,
    height: 6240,
    alt: "Black and white close-up of a bride beneath her veil",
    title: "Held Breath",
    category: "Weddings",
    description: "The pause between anticipation and forever.",
    meta: "ƒ/1.8 · 1/320 · ISO 640",
  },
  {
    id: "w5",
    src: px(34172822, 1200),
    width: 5979,
    height: 8698,
    alt: "Romantic indoor wedding portrait of a couple in traditional dress",
    title: "Golden Hour, Indoors",
    category: "Weddings",
    description: "Window light and heritage — a celebration in Jakarta.",
    meta: "ƒ/2.2 · 1/200 · ISO 500",
  },
  {
    id: "w6",
    src: px(33425290, 1200),
    width: 4000,
    height: 6000,
    alt: "Detail of an elegant lace wedding dress",
    title: "Thread & Light",
    category: "Weddings",
    description: "Every seam holds a story someone chose to wear.",
    meta: "ƒ/2.8 · 1/125 · ISO 320",
  },
  // ——— Portraits ———
  {
    id: "p1",
    src: px(1729249, 1200),
    width: 4912,
    height: 7360,
    alt: "Artistic portrait of a woman in dramatic red light and shadow",
    title: "Crimson Study",
    category: "Portraits",
    description: "A study in colour, shadow, and the courage to be seen.",
    meta: "ƒ/2.0 · 1/160 · ISO 200",
  },
  {
    id: "p2",
    src: px(18018264, 1200),
    width: 5152,
    height: 7728,
    alt: "Moody studio portrait of a young man with dramatic lighting",
    title: "Half Light",
    category: "Portraits",
    description: "One light, one face, nothing to hide behind.",
    meta: "ƒ/2.8 · 1/200 · ISO 100",
  },
  {
    id: "p3",
    src: px(35964824, 1200),
    width: 4160,
    height: 6240,
    alt: "Side profile portrait of a man in moody, dramatic light",
    title: "Profile in Bronze",
    category: "Portraits",
    description: "Some faces are built for silence.",
    meta: "ƒ/1.8 · 1/250 · ISO 160",
  },
  {
    id: "p4",
    src: px(29793410, 1200),
    width: 4000,
    height: 6000,
    alt: "Striking black and white portrait with dramatic shadows",
    title: "Fracture",
    category: "Portraits",
    description: "Shadow is just light that chose a side.",
    meta: "ƒ/4.0 · 1/125 · ISO 400",
  },
  {
    id: "p5",
    src: px(13583393, 1200),
    width: 5449,
    height: 6812,
    alt: "Portrait of a woman with striking eyes in a dark room",
    title: "The Gaze",
    category: "Portraits",
    description: "She held the camera's stare longer than anyone I've photographed.",
    meta: "ƒ/1.4 · 1/200 · ISO 800",
  },
  {
    id: "p6",
    src: px(16932929, 1200),
    width: 4000,
    height: 6000,
    alt: "Portrait of a man with dramatic side lighting and introspective mood",
    title: "Quiet Weather",
    category: "Portraits",
    description: "Introspection, lit from the left.",
    meta: "ƒ/2.5 · 1/160 · ISO 250",
  },
  // ——— Editorial ———
  {
    id: "e1",
    src: px(33852945, 1200),
    width: 4672,
    height: 7008,
    alt: "Striking fashion portrait of a model under bold red lighting",
    title: "Scarlet Issue",
    category: "Editorial",
    description: "Cover concept for an independent fashion quarterly.",
    meta: "ƒ/5.6 · 1/160 · ISO 100",
  },
  {
    id: "e2",
    src: px(33714925, 1200),
    width: 4350,
    height: 6525,
    alt: "Fashion model in a black dress posing in a red-lit studio",
    title: "After Hours",
    category: "Editorial",
    description: "Studio session — gels, smoke, and attitude.",
    meta: "ƒ/4.5 · 1/200 · ISO 160",
  },
  {
    id: "e3",
    src: px(10370358, 1200),
    width: 4160,
    height: 6240,
    alt: "Model in a black tulle outfit striking a pose against a white backdrop",
    title: "Tulle Storm",
    category: "Editorial",
    description: "Movement study in black tulle, shot on white.",
    meta: "ƒ/8.0 · 1/250 · ISO 100",
  },
  {
    id: "e4",
    src: px(19927197, 1200),
    width: 4640,
    height: 6960,
    alt: "Fashion model posing in a studio with dramatic blue lighting",
    title: "Blue Period",
    category: "Editorial",
    description: "A nod to the painters — colour as emotion.",
    meta: "ƒ/3.5 · 1/160 · ISO 200",
  },
  // ——— Cars ———
  {
    id: "car1",
    src: "/car-1.jpg",
    width: 960,
    height: 1280,
    alt: "Black lifted pickup truck glowing with teal and blue underglow LEDs at night",
    title: "Midnight Glow",
    category: "Cars",
    description: "Custom underglow turns an empty parking lot into a stage.",
    meta: "ƒ/2.8 · 1/60 · ISO 800",
  },
  {
    id: "car2",
    src: "/car-2.jpg",
    width: 960,
    height: 1280,
    alt: "Blue coupe with glowing LED wheels parked at night beside palm trees",
    title: "Neon Wheels",
    category: "Cars",
    description: "Blue light, palm silhouettes, a South Florida night.",
    meta: "ƒ/2.2 · 1/50 · ISO 640",
  },
  {
    id: "car3",
    src: px(9661473, 1600),
    width: 5472,
    height: 3648,
    alt: "Row of sports cars parked on a dimly lit street at night",
    title: "Night Lineup",
    category: "Cars",
    description: "A late-night meet, engines cooling under sodium light.",
    meta: "ƒ/4.0 · 1/125 · ISO 400",
  },
  {
    id: "car4",
    src: px(12590851, 1600),
    width: 5472,
    height: 3648,
    alt: "Black sports car with a spoiler waiting on the roadside at night",
    title: "Roadside",
    category: "Cars",
    description: "Waiting on the shoulder, headlights cutting through the dark.",
    meta: "ƒ/3.2 · 1/100 · ISO 500",
  },
  {
    id: "car5",
    src: px(5880077, 1200),
    width: 3490,
    height: 5235,
    alt: "Modern sports car parked on a city street at night",
    title: "City Idle",
    category: "Cars",
    description: "Downtown after hours, chrome catching every streetlight.",
    meta: "ƒ/2.8 · 1/80 · ISO 640",
  },
  // ——— Animals ———
  {
    id: "an1",
    src: "/animal-1.jpg",
    width: 1280,
    height: 959,
    alt: "Two young opossums huddled together in fallen autumn leaves",
    title: "Den Mates",
    category: "Animals",
    description: "Backyard visitors, caught mid-stare beneath the porch light.",
    meta: "ƒ/4.5 · 1/125 · ISO 1600",
  },
  {
    id: "an2",
    src: px(36331589, 1600),
    width: 4586,
    height: 3669,
    alt: "Close-up of an American alligator resting at the water's edge",
    title: "Still Water",
    category: "Animals",
    description: "Florida wetlands — patience is the whole lens.",
    meta: "ƒ/5.6 · 1/500 · ISO 200",
  },
  {
    id: "an3",
    src: px(11462842, 1600),
    width: 3398,
    height: 2064,
    alt: "An alligator resting in a quiet swamp",
    title: "Swamp Watch",
    category: "Animals",
    description: "It didn't move for twenty minutes. Neither did I.",
    meta: "ƒ/6.3 · 1/320 · ISO 250",
  },
  {
    id: "an4",
    src: px(13694791, 1200),
    width: 5568,
    height: 3712,
    alt: "Close-up portrait of a Eurasian eagle owl with striking eyes",
    title: "Night Vision",
    category: "Animals",
    description: "Feathers built for silence, eyes built for the dark.",
    meta: "ƒ/4.0 · 1/200 · ISO 800",
  },
  // ——— Nature ———
  {
    id: "n1",
    src: "/sky-1.jpg",
    width: 960,
    height: 1280,
    alt: "Crescent moon over a dramatic evening sky with clouds above the ocean and a pier",
    title: "Rising Crescent",
    category: "Nature",
    description: "Dusk over the pier, moon keeping watch.",
    meta: "ƒ/2.8 · 1/60 · ISO 200",
  },
  {
    id: "n2",
    src: "/sky-2.jpg",
    width: 960,
    height: 1280,
    alt: "Soft sunset light behind clouds over a calm ocean horizon",
    title: "Horizon Line",
    category: "Nature",
    description: "The last light of the day, folding into the water.",
    meta: "ƒ/4.0 · 1/250 · ISO 100",
  },
  {
    id: "n3",
    src: "https://images.pexels.com/photos/6858/landscape-nature-forest-trees.jpg?auto=compress&cs=tinysrgb&w=1600",
    width: 3214,
    height: 2411,
    alt: "A foggy path winding through towering fir trees in a serene forest",
    title: "Green Woods",
    category: "Nature",
    description: "Morning fog finding its way through the canopy.",
    meta: "ƒ/5.6 · 1/160 · ISO 200",
  },
  {
    id: "n4",
    src: px(235852, 1600),
    width: 2201,
    height: 1238,
    alt: "A cabin nestled near pine trees beside a mountain river",
    title: "Riverside",
    category: "Nature",
    description: "Where the trail ends and the quiet begins.",
    meta: "ƒ/8.0 · 1/125 · ISO 100",
  },
];

/** Visitor-uploaded replacements, keyed by photo id. */
export type PhotoOverrides = Record<
  string,
  { src: string; width: number; height: number }
>;

export function withOverride<T extends Photo>(photo: T, overrides: PhotoOverrides): T {
  const o = overrides[photo.id];
  return o ? { ...photo, ...o } : photo;
}

export const featuredPhotos = [
  photos.find((p) => p.id === "p1")!,
  photos.find((p) => p.id === "car2")!,
  photos.find((p) => p.id === "w2")!,
  photos.find((p) => p.id === "n1")!,
  photos.find((p) => p.id === "e3")!,
];
