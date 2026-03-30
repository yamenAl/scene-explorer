/**
 * Scene id from SuperSplat (same as in /s?id=…).
 * Change this to embed a different splat.
 */
export const SCENE_ID = "08ef0b52";

/**
 * &noui hides SuperSplat’s #ui: bottom controls, branding, etc.
 * Do not add ?settings= — that re-enables embedded branding and is not used here.
 */
export const VIEWER_URL = `https://superspl.at/s?id=${SCENE_ID}&noui`;
