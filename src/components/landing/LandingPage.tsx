"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BRAND_LOGO_FIRST, BRAND_LOGO_SECOND } from "@/lib/brand";
import { LandingLoader } from "@/components/landing/LandingLoader";
import { SceneBackdrop } from "@/components/landing/SceneBackdrop";
import {
  landingBackdropUrlAtIndex,
  landingSceneLabel,
  nextLandingBackdropIndex,
} from "@/lib/scene";
import "@/app/landing.css";

const HERO_HEADLINE_ACCENT = "Like You're Really There";

type LandingPageProps = {
  /** From `/?b=` — progressive enhancement when JS is off. */
  initialBackdropIndex: number;
};

export function LandingPage({ initialBackdropIndex }: LandingPageProps) {
  const router = useRouter();
  const [backdropIdx, setBackdropIdx] = useState(initialBackdropIndex);
  const [inScene, setInScene] = useState(false);
  const backdropSrc = landingBackdropUrlAtIndex(backdropIdx);
  const nextBackdropHref = `/?b=${nextLandingBackdropIndex(backdropIdx)}`;
  const sceneLabel = landingSceneLabel(backdropSrc);
  const sceneIframeRef = useRef<HTMLIFrameElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mx = useRef(0);
  const my = useRef(0);
  const rx = useRef(0);
  const ry = useRef(0);
  const rafCursor = useRef<number>(0);

  useEffect(() => {
    setBackdropIdx(initialBackdropIndex);
  }, [initialBackdropIndex]);

  useEffect(() => {
    if (inScene) {
      document.documentElement.classList.remove("landing-cursor");
    } else {
      document.documentElement.classList.add("landing-cursor");
    }
    return () => document.documentElement.classList.remove("landing-cursor");
  }, [inScene]);

  useEffect(() => {
    if (!inScene) return;
    const focusIframe = () => {
      sceneIframeRef.current?.focus();
    };
    requestAnimationFrame(focusIframe);
    const t = window.setTimeout(focusIframe, 120);
    return () => window.clearTimeout(t);
  }, [inScene]);

  useEffect(() => {
    if (!inScene) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInScene(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inScene]);

  useEffect(() => {
    if (inScene) return;

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return () => document.removeEventListener("mousemove", onMove);

    const onEnter = () => {
      cursor.style.width = "6px";
      cursor.style.height = "6px";
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.opacity = "0.8";
    };
    const onLeave = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.opacity = "0.5";
    };

    const els = document.querySelectorAll<HTMLElement>(".lp a, .lp button");
    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const tick = () => {
      cursor.style.left = `${mx.current}px`;
      cursor.style.top = `${my.current}px`;
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      ring.style.left = `${rx.current}px`;
      ring.style.top = `${ry.current}px`;
      rafCursor.current = requestAnimationFrame(tick);
    };
    rafCursor.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafCursor.current);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [inScene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      reset: () => void;
      update: () => void;
      draw: (c: CanvasRenderingContext2D) => void;
    };

    function createParticle(): Particle {
      const p: Particle = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 0,
        a: 0,
        reset() {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = (Math.random() - 0.5) * 0.3;
          p.r = Math.random() * 1.5 + 0.5;
          p.a = Math.random() * 0.6 + 0.2;
        },
        update() {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) p.reset();
        },
        draw(c) {
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c.fillStyle = `rgba(0,245,255,${p.a})`;
          c.fill();
        },
      };
      p.reset();
      return p;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) particles.push(createParticle());

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawGrid = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,245,255,0.04)";
      ctx.lineWidth = 1;
      const gs = 60;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw(ctx);
      }
      raf = requestAnimationFrame(drawGrid);
    };
    drawGrid();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`lp${inScene ? " lp--in-scene" : ""}`}>
      <LandingLoader />
      <SceneBackdrop ref={sceneIframeRef} src={backdropSrc} interactive={inScene} />
      {/* ~30% transparent: old #030610 film so scene barely shows through */}
      <div className="lp-bg-film" aria-hidden />

      <div ref={cursorRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <canvas id="grid-canvas" ref={canvasRef} aria-hidden />

      {inScene && (
        <button type="button" className="lp-exit-scene" onClick={() => setInScene(false)}>
          Exit scene
        </button>
      )}

      <div className="lp-chrome">
        <a href="#main-content" className="lp-skip-link">
          Skip to main content
        </a>
        <header className="lp-site-header">
          <nav aria-label="Site">
            <Link href="/" className="nav-logo">
              {BRAND_LOGO_FIRST}
              <span>{BRAND_LOGO_SECOND}</span>
            </Link>
          </nav>
        </header>

        <main id="main-content" className="lp-main">
          <section id="hero" aria-label="Introduction">
            <div className="blob blob-1" aria-hidden />
            <div className="blob blob-2" aria-hidden />
            <div className="blob blob-3" aria-hidden />

            <p className="hero-eyebrow">DISCOVER REAL PLACES</p>

            <h1 className="hero-title">
              <span>Explore the World</span>
              <span className="accent glitch" data-text={HERO_HEADLINE_ACCENT}>
                {HERO_HEADLINE_ACCENT}
              </span>
            </h1>

            <p className="hero-sub">
              Step inside breathtaking places, captured in stunning photorealistic detail, no downloads, no limits. Just
              explore.
            </p>

            <div className="hero-cta">
              <button type="button" className="btn-primary" onClick={() => setInScene(true)}>
                Enter the Scene
              </button>
              <Link
                href={nextBackdropHref}
                className="btn-secondary"
                aria-label="Switch to the next world in rotation"
                onClick={(e) => {
                  e.preventDefault();
                  const nextIdx = nextLandingBackdropIndex(backdropIdx);
                  setBackdropIdx(nextIdx);
                  router.replace(`/?b=${nextIdx}`, { scroll: false });
                }}
              >
                Next world
              </Link>
            </div>
            <p className="hero-magic-note">
              You are previewing <strong>{sceneLabel}</strong> · Open full screen for the full experience
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
