/**
 * SuperSplat scene id (from the URL /scene/08ef0b52).
 * Change this string to embed a different splat.
 */
export const SCENE_ID = "08ef0b52";

/** Iframe src: minimal viewer, no SuperSplat UI (?noui). */
export const VIEWER_URL = `https://superspl.at/s?id=${SCENE_ID}&noui`;

/** Opens the full SuperSplat page (comments, share, etc.). */
export const SCENE_PAGE_URL = `https://superspl.at/scene/${SCENE_ID}`;
