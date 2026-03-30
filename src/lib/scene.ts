/**
 * Scene id from SuperSplat (same as in /s?id=…).
 * Change this to embed a different splat.
 */
export const SCENE_ID = "08ef0b52";

/**
 * Viewer with ?noui — hides SuperSplat’s bottom bar (orbit / fly / walk / settings / etc.).
 * @see https://github.com/playcanvas/supersplat-viewer#user-content-url-parameters
 */
export const VIEWER_URL = `https://superspl.at/s?id=${SCENE_ID}&noui`;

/** Full scene page on SuperSplat (share, comments). */
export const SCENE_PAGE_URL = `https://superspl.at/scene/${SCENE_ID}`;
