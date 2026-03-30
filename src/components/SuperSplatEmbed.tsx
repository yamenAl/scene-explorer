"use client";

/**
 * Full-screen SuperSplat iframe + a few HTML controls on top.
 *
 * The iframe loads VIEWER_URL (see src/lib/scene.ts). Clicks on the page go
 * to our buttons; clicks on the iframe go to the 3D viewer (WASD, mouse look).
 */

import { useEffect, useRef, useState } from "react";
import { SCENE_PAGE_URL, VIEWER_URL } from "@/lib/scene";

const HELP_AUTO_HIDE_MS = 12_000;

const cornerBtnClass =
  "pointer-events-auto rounded border border-zinc-700/90 bg-black/75 px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 backdrop-blur-sm hover:border-zinc-500 hover:text-white";

export function SuperSplatEmbed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  async function onFullscreenClick() {
    const el = rootRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Browser blocked fullscreen (permissions, etc.)
    }
  }

  useEffect(() => {
    function syncFullscreen() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (!showHelp) return;
    const id = window.setTimeout(() => setShowHelp(false), HELP_AUTO_HIDE_MS);
    return () => window.clearTimeout(id);
  }, [showHelp]);

  return (
    <div ref={rootRef} className="relative h-svh w-full overflow-hidden bg-black">
      {/* Loading layer sits above the iframe until it fires onLoad */}
      {!iframeLoaded && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black"
          aria-busy="true"
          aria-label="Loading"
        >
          <div className="h-1 w-40 max-w-[50%] overflow-hidden rounded-full bg-zinc-900">
            <div className="h-full w-1/3 animate-cyber-shimmer rounded-full bg-[linear-gradient(90deg,transparent,var(--cyber-cyan),transparent)]" />
          </div>
          <p className="font-mono text-[10px] tracking-widest text-zinc-500">LOADING</p>
        </div>
      )}

      <iframe
        title="3D room viewer"
        src={VIEWER_URL}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="eager"
        onLoad={() => setIframeLoaded(true)}
      />

      {/* Wrapper ignores clicks except on the real controls (pointer-events-auto) */}
      <div className="pointer-events-none absolute right-3 top-3 z-20 flex gap-2 md:right-4 md:top-4">
        <button
          type="button"
          className={cornerBtnClass}
          title="Help"
          onClick={() => setShowHelp((v) => !v)}
        >
          ?
        </button>
        <button type="button" className={cornerBtnClass} onClick={onFullscreenClick}>
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
        <a
          className={`${cornerBtnClass} text-zinc-400 hover:text-zinc-200`}
          href={SCENE_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          SuperSplat
        </a>
      </div>

      {showHelp && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4 md:p-6">
          <div className="pointer-events-auto max-w-lg rounded-lg border border-zinc-700/80 bg-black/80 px-4 py-3 text-sm text-zinc-300 shadow-lg backdrop-blur-md">
            <p className="font-medium text-zinc-100">How to move</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Click inside the 3D view once. Then use WASD to walk and the mouse to look
              around.
            </p>
            <button
              type="button"
              className="mt-3 text-xs text-[var(--cyber-cyan-dim)] hover:underline"
              onClick={() => setShowHelp(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
