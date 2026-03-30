"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { SCENE_BACKDROP_MIN_LOADING_MS } from "@/lib/scene";

type SceneBackdropProps = {
  src: string;
  /** When false, backdrop is inert and the iframe is not tab-focusable (landing overlay). */
  interactive?: boolean;
};

/**
 * Full-viewport splat viewer behind the landing overlay (&noui).
 */
export const SceneBackdrop = forwardRef<HTMLIFrameElement, SceneBackdropProps>(
  function SceneBackdrop({ src, interactive = false }, ref) {
    const [loaded, setLoaded] = useState(false);
    const loadStartedAt = useRef(0);
    const revealTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
      setLoaded(false);
      loadStartedAt.current = performance.now();
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }
      const fallback = window.setTimeout(() => setLoaded(true), 25_000);
      return () => {
        window.clearTimeout(fallback);
        if (revealTimeoutRef.current) {
          window.clearTimeout(revealTimeoutRef.current);
          revealTimeoutRef.current = null;
        }
      };
    }, [src]);

    const scheduleReveal = () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
      }
      const elapsed = performance.now() - loadStartedAt.current;
      const wait = Math.max(0, SCENE_BACKDROP_MIN_LOADING_MS - elapsed);
      revealTimeoutRef.current = window.setTimeout(() => {
        revealTimeoutRef.current = null;
        setLoaded(true);
      }, wait);
    };

    return (
      <div
        className="lp-scene-backdrop"
        // Only set `inert` when blocking interaction. HTML treats *any* present `inert` as true
        // (even `inert="false"`), so never pass `inert={false}` — omit the attribute instead.
        {...(!interactive ? { inert: true as const } : {})}
      >
        {!loaded && (
          <div
            className="lp-scene-loading"
            aria-busy="true"
            aria-label="Loading 3D scene"
          >
            <div className="lp-scene-loading-bar" />
            <p className="lp-scene-loading-label">LOADING</p>
          </div>
        )}
        <iframe
          ref={ref}
          key={src}
          tabIndex={interactive ? 0 : -1}
          title="3D scene"
          src={src}
          className="lp-scene-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; xr-spatial-tracking; web-share"
          allowFullScreen
          loading="eager"
          onLoad={scheduleReveal}
        />
      </div>
    );
  },
);
