/**
 * Scene id from SuperSplat (same as in /s?id=…).
 * Change this to embed a different splat.
 */
export const SCENE_ID = "08ef0b52";

/**
 * Official minimal viewer embed (matches SuperSplat “Embed” iframe).
 * Example: <iframe src="https://superspl.at/s?id=08ef0b52" …>
 */
export const VIEWER_URL = `https://superspl.at/s?id=${SCENE_ID}`;

/** Full scene page on SuperSplat (share, comments). */
export const SCENE_PAGE_URL = `https://superspl.at/scene/${SCENE_ID}`;
