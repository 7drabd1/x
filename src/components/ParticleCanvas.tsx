import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  /** current velocity, px per second */
  vx: number;
  vy: number;
  /** resting drift the particle eases back to */
  bx: number;
  by: number;
  r: number;
  alpha: number;
  color: string;
  phase: number;
  twinkle: number;
}

const GOLD = '226, 192, 68';
const EMERALD = '16, 185, 129';
const POINTER_RADIUS = 150;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Slow golden and emerald dust that drifts upward and drifts aside when a cursor or finger passes through.
 * Paused while the tab is hidden; drawn once, without motion, when the visitor prefers reduced motion.
 */
export function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let releaseTimer = 0;

    const spawn = (anywhere: boolean): Particle => {
      const bx = rand(-5, 5);
      const by = rand(-9, -2);
      return {
        x: rand(0, width),
        y: anywhere ? rand(0, height) : height + 12,
        vx: bx,
        vy: by,
        bx,
        by,
        r: rand(0.6, 2),
        alpha: rand(0.25, 0.8),
        color: Math.random() < 0.65 ? GOLD : EMERALD,
        phase: rand(0, Math.PI * 2),
        twinkle: rand(0.25, 0.7),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(70, Math.round((width * height) / 22000)));
      particles = Array.from({ length: count }, () => spawn(true));
      if (reduced.matches) draw(0);
    };

    const step = (dt: number) => {
      for (const p of particles) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_RADIUS && dist > 0.001) {
          const push = (1 - dist / POINTER_RADIUS) ** 2 * 90;
          p.vx += (dx / dist) * push * dt;
          p.vy += (dy / dist) * push * dt;
        }
        // ease back to the resting drift
        const ease = Math.min(1, dt * 0.9);
        p.vx += (p.bx - p.vx) * ease;
        p.vy += (p.by - p.vy) * ease;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.y < -14) Object.assign(p, spawn(false));
        if (p.x < -14) p.x = width + 14;
        if (p.x > width + 14) p.x = -14;
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const a = p.alpha * (0.65 + 0.35 * Math.sin(time * p.twinkle + p.phase));
        ctx.fillStyle = `rgba(${p.color}, ${a * 0.12})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${p.color}, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw(now / 1000);
    };

    const start = () => {
      if (raf || reduced.matches || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      window.clearTimeout(releaseTimer);
    };
    const onRelease = (e: PointerEvent) => {
      // a lifted finger leaves the field; a mouse keeps its position until it moves away
      if (e.pointerType === 'mouse') return;
      releaseTimer = window.setTimeout(() => {
        pointer.x = pointer.y = -9999;
      }, 500);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionPref = () => {
      stop();
      if (reduced.matches) draw(0);
      else start();
    };

    resize();
    start();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', onMotionPref);

    return () => {
      stop();
      window.clearTimeout(releaseTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onRelease);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onMotionPref);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0" />;
}
