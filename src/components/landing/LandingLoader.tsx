"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "@/app/landing-loader.css";

const TICK_COUNT = 20;

const PHASES = [
  { pct: 15, label: "BOOT SEQUENCE", msg: "> initializing core systems..." },
  { pct: 32, label: "LOADING SHADERS", msg: "> compiling WebGL shaders..." },
  { pct: 51, label: "BUILDING SCENE", msg: "> reconstructing 3D environment..." },
  { pct: 67, label: "STREAMING SPLATS", msg: "> decompressing gaussian data..." },
  { pct: 82, label: "CALIBRATING", msg: "> aligning point-cloud matrices..." },
  { pct: 94, label: "FINALIZING", msg: "> rendering final frame..." },
  { pct: 100, label: "READY", msg: "> system online. welcome." },
] as const;

function phaseForProgress(current: number) {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (current >= PHASES[i].pct) return PHASES[i];
  }
  return PHASES[0];
}

function updateTicks(container: HTMLElement | null, pct: number) {
  if (!container) return;
  const active = Math.round((pct / 100) * TICK_COUNT);
  container.querySelectorAll<HTMLElement>(".lp-loader__tick").forEach((el, i) => {
    el.classList.toggle("lp-loader__tick--active", i < active);
  });
}

export function LandingLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const pctEl = pctRef.current;
    const termEl = termRef.current;
    const phaseEl = phaseRef.current;
    const ticksEl = ticksRef.current;
    if (!root || !fill || !pctEl || !termEl || !phaseEl) return;

    document.body.style.overflow = "hidden";

    const progress = { value: 0 };
    let aborted = false;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onComplete: () => {
          document.body.style.overflow = "";
          if (!aborted) setMounted(false);
        },
      });

      tl.to(progress, {
        value: 100,
        duration: 2.8,
        ease: "power3.inOut",
        onUpdate: () => {
          if (aborted) return;
          const current = Math.round(progress.value);
          fill.style.width = `${current}%`;
          pctEl.innerHTML = `${current}<sup>%</sup>`;
          const ph = phaseForProgress(current);
          phaseEl.textContent = ph.label;
          termEl.textContent = ph.msg;
          updateTicks(ticksEl, current);
        },
      });

      tl.to(root, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.35");
    }, root);

    return () => {
      aborted = true;
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="lp-loader lp-loader__scan" aria-busy="true" aria-live="polite">
      <div className="lp-loader__corner lp-loader__corner--tl" aria-hidden />
      <div className="lp-loader__corner lp-loader__corner--tr" aria-hidden />
      <div className="lp-loader__corner lp-loader__corner--bl" aria-hidden />
      <div className="lp-loader__corner lp-loader__corner--br" aria-hidden />

      <div className="lp-loader__inner">
        <div className="lp-loader__logo lp-loader__logo--tagline">
          The world is <span>waking up for you</span>
        </div>

        <div className="lp-loader__hex">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <polygon
              points="50,4 93,27.5 93,72.5 50,96 7,72.5 7,27.5"
              stroke="#00f5ff"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <polygon
              points="50,14 83,32 83,68 50,86 17,68 17,32"
              stroke="#ff00c8"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
              transform="rotate(30 50 50)"
            />
            <polygon
              points="50,24 76,38.5 76,61.5 50,76 24,61.5 24,38.5"
              stroke="#00f5ff"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <circle cx="50" cy="50" r="4" fill="#00f5ff" opacity="0.9" />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="#00f5ff"
              strokeWidth="1"
              strokeDasharray="6 10"
              opacity="0.25"
            />
          </svg>
          <div className="lp-loader__hex-inner" aria-hidden />
        </div>

        <div ref={pctRef} className="lp-loader__pct">
          0<sup>%</sup>
        </div>

        <div className="lp-loader__bar-wrap">
          <div className="lp-loader__bar-meta">
            <span>INITIALIZING</span>
            <span ref={phaseRef}>BOOT SEQUENCE</span>
          </div>
          <div className="lp-loader__bar-track">
            <div ref={fillRef} className="lp-loader__bar-fill" />
          </div>
          <div ref={ticksRef} className="lp-loader__ticks">
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <div key={i} className="lp-loader__tick" />
            ))}
          </div>
        </div>

        <div ref={termRef} className="lp-loader__terminal">
          &gt; loading assets...
        </div>
      </div>
    </div>
  );
}
