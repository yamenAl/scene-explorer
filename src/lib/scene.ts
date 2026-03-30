/**
 * Scene id from SuperSplat (same as in /s?id=…).
 * Change this to embed a different splat.
 */
export const SCENE_ID = "08ef0b52";

/** Alternate splat for the landing “magic” CTA — same embed rules as the default scene. */
export const MAGIC_SCENE_ID = "11f85c13";

/** “Cat sense” splat in the landing rotation (id unchanged on SuperSplat). */
export const NEXUS_SCENE_ID = "fd94aae3";

/** “Gallery” splat in the rotation (id a8a02929 on SuperSplat). */
export const BEACON_SCENE_ID = "a8a02929";

/** Fifth landing splat. */
export const PRISM_SCENE_ID = "a4826a74";

/** Sixth landing splat. */
export const DRIFT_SCENE_ID = "ef268c7c";

/** Seventh landing splat. */
export const SHARD_SCENE_ID = "22404a57";

/** Eighth landing splat. */
export const ECHO_SCENE_ID = "e05e5eb7";

/** Ninth landing splat. */
export const NODE_SCENE_ID = "67841e9d";

/** Tenth landing splat. */
export const FLARE_SCENE_ID = "fee61f2d";

/** Eleventh landing splat. */
export const ARC_SCENE_ID = "6f697c4d";

/**
 * After “Next world”, the iframe `load` event often fires before the splat feels ready.
 * The backdrop loading strip stays visible at least this long so the animation is readable.
 */
export const SCENE_BACKDROP_MIN_LOADING_MS = 2800;

/**
 * &noui hides SuperSplat’s #ui: bottom controls, branding, etc.
 * Do not add ?settings= — that re-enables embedded branding and is not used here.
 */
export const VIEWER_URL = `https://superspl.at/s?id=${SCENE_ID}&noui`;

export const MAGIC_VIEWER_URL = `https://superspl.at/s?id=${MAGIC_SCENE_ID}&noui`;

export const NEXUS_VIEWER_URL = `https://superspl.at/s?id=${NEXUS_SCENE_ID}&noui`;

export const BEACON_VIEWER_URL = `https://superspl.at/s?id=${BEACON_SCENE_ID}&noui`;

export const PRISM_VIEWER_URL = `https://superspl.at/s?id=${PRISM_SCENE_ID}&noui`;

export const DRIFT_VIEWER_URL = `https://superspl.at/s?id=${DRIFT_SCENE_ID}&noui`;

export const SHARD_VIEWER_URL = `https://superspl.at/s?id=${SHARD_SCENE_ID}&noui`;

export const ECHO_VIEWER_URL = `https://superspl.at/s?id=${ECHO_SCENE_ID}&noui`;

export const NODE_VIEWER_URL = `https://superspl.at/s?id=${NODE_SCENE_ID}&noui`;

export const FLARE_VIEWER_URL = `https://superspl.at/s?id=${FLARE_SCENE_ID}&noui`;

export const ARC_VIEWER_URL = `https://superspl.at/s?id=${ARC_SCENE_ID}&noui`;

/**
 * Friendly names for each landing backdrop (what you see in the splat).
 * Keys are full viewer URLs; tweak labels anytime.
 */
export const LANDING_SCENE_LABELS: Readonly<Record<string, string>> = {
  [VIEWER_URL]: "Cyberpunk",
  [MAGIC_VIEWER_URL]: "Water fall",
  [NEXUS_VIEWER_URL]: "Cat sense",
  [BEACON_VIEWER_URL]: "Gallery",
  [PRISM_VIEWER_URL]: "Mountain Range",
  [DRIFT_VIEWER_URL]: "Drift horizon",
  [SHARD_VIEWER_URL]: "Garage",
  [ECHO_VIEWER_URL]: "Painting",
  [NODE_VIEWER_URL]: "Human sense",
  [FLARE_VIEWER_URL]: "Nike shoes",
  [ARC_VIEWER_URL]: "A place you would like",
};

export function landingSceneLabel(viewerUrl: string): string {
  return LANDING_SCENE_LABELS[viewerUrl] ?? "Scene";
}

/** Landing backdrop order: each click advances to the next, then wraps to the first. */
export const LANDING_SCENE_CYCLE: readonly string[] = [
  VIEWER_URL,
  MAGIC_VIEWER_URL,
  NEXUS_VIEWER_URL,
  BEACON_VIEWER_URL,
  PRISM_VIEWER_URL,
  DRIFT_VIEWER_URL,
  SHARD_VIEWER_URL,
  ECHO_VIEWER_URL,
  NODE_VIEWER_URL,
  FLARE_VIEWER_URL,
  ARC_VIEWER_URL,
];

export function nextLandingSceneUrl(current: string): string {
  const i = LANDING_SCENE_CYCLE.indexOf(current);
  const idx = i < 0 ? 0 : i;
  return LANDING_SCENE_CYCLE[(idx + 1) % LANDING_SCENE_CYCLE.length]!;
}

/** `?b=` on `/` — integer index into `LANDING_SCENE_CYCLE` (progressive enhancement). */
export function landingBackdropIndexFromQuery(b: string | undefined): number {
  if (b === undefined || b === "") return 0;
  const n = Number.parseInt(b, 10);
  if (!Number.isFinite(n) || n < 0 || n >= LANDING_SCENE_CYCLE.length) return 0;
  return n;
}

export function landingBackdropUrlAtIndex(index: number): string {
  const i = ((index % LANDING_SCENE_CYCLE.length) + LANDING_SCENE_CYCLE.length) % LANDING_SCENE_CYCLE.length;
  return LANDING_SCENE_CYCLE[i]!;
}

export function nextLandingBackdropIndex(currentIndex: number): number {
  return (currentIndex + 1) % LANDING_SCENE_CYCLE.length;
}
