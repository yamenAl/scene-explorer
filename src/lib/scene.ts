/**
 * SuperSplat scene id (from the URL /scene/08ef0b52).
 * Change this string to embed a different splat.
 */
export const SCENE_ID = "08ef0b52";

/** File in /public — edit to move hotspots or change title/text (see annotations). */
export const SETTINGS_PATH = "/splat-settings.json";

/** Opens the full SuperSplat page (comments, share, etc.). */
export const SCENE_PAGE_URL = `https://superspl.at/scene/${SCENE_ID}`;

/**
 * Viewer URL with optional ?settings= pointing at this site's splat-settings.json.
 * Omitting `noui` is required so SuperSplat shows clickable annotation hotspots.
 */
export function viewerUrlWithSettings(settingsAbsoluteUrl: string): string {
  const u = new URL("https://superspl.at/s");
  u.searchParams.set("id", SCENE_ID);
  u.searchParams.set("settings", settingsAbsoluteUrl);
  return u.toString();
}
