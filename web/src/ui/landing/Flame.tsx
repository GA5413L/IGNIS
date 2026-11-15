'use client';

import { useEffect, useRef } from 'react';

/**
 * Decorative spherical flame artwork. Its changing appearance follows the page sections, not a physical
 * model. Microgravity flames are not universally spherical: geometry and imposed flow also matter.
 */
export type FlameState = 'burning' | 'rich' | 'sensed' | 'cool' | 'model' | 'dim';

interface Look { glow: number; radius: number; warm: number; rings: number; x: number; y: number }
const LOOKS: Record<FlameState, Look> = {
  burning: { glow: 1, radius: 1, warm: 0.55, rings: 0, x: 0.73, y: 0.46 },
  rich: { glow: 0.62, radius: 1.16, warm: 0.8, rings: 0, x: 0.9, y: 0.2 },
  sensed: { glow: 0.5, radius: 0.92, warm: 0.3, rings: 1, x: 0.9, y: 0.2 },
  cool: { glow: 0.16, radius: 0.86, warm: 0, rings: 0, x: 0.9, y: 0.2 },
  model: { glow: 0.36, radius: 0.8, warm: 0.2, rings: 0, x: 0.9, y: 0.2 },
  dim: { glow: 0.8, radius: 0.78, warm: 0.5, rings: 0, x: 0.5, y: 0.19 },
};
const PARTICLES = 90;

export default function Flame({ state }: { state: FlameState }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef<FlameState>(state);

  useEffect(() => { target.current = state; }, [state]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const now: Look = { ...LOOKS[target.current] };
    const seeds = Array.from({ length: PARTICLES }, (_, index) => ({ angle: (index * 2.399963) % (Math.PI * 2), phase: (index * 0.6180339) % 1, speed: 0.035 + ((index * 7) % 13) * 0.004, size: 0.6 + ((index * 5) % 7) * 0.16 }));
    let width = 0, height = 0, frame = 0, last = 0, running = true;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      const goal = LOOKS[target.current];
      const narrow = width < 900;
      const gx = narrow ? 0.5 : goal.x, gy = narrow ? (target.current === 'burning' ? 0.26 : target.current === 'dim' ? 0.22 : 0.12) : goal.y;
      const ease = reduced.matches ? 1 : 0.045;
      now.glow += (goal.glow * (narrow && target.current !== 'burning' && target.current !== 'dim' ? 0.7 : 1) - now.glow) * ease;
      now.radius += (goal.radius - now.radius) * ease; now.warm += (goal.warm - now.warm) * ease;
      now.rings += (goal.rings - now.rings) * ease; now.x += (gx - now.x) * ease; now.y += (gy - now.y) * ease;

      const t = reduced.matches ? 0 : time / 1000;
      const cx = width * now.x, cy = height * now.y;
      const base = Math.min(width, height) * (narrow ? 0.2 : 0.17) * now.radius;
      const radius = base * (1 + 0.018 * Math.sin(t * 1.3) + 0.01 * Math.sin(t * 2.9));
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const halo = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 3.4);
      halo.addColorStop(0, `rgba(46, 118, 255, ${0.26 * now.glow})`);
      halo.addColorStop(0.35, `rgba(30, 84, 220, ${0.09 * now.glow})`);
      halo.addColorStop(1, 'rgba(10, 30, 120, 0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, width, height);

      for (let pass = 0; pass < 3; pass += 1) {
        const ox = Math.sin(t * (0.7 + pass * 0.31) + pass * 2.1) * radius * 0.035, oy = Math.cos(t * (0.9 + pass * 0.27) + pass) * radius * 0.035;
        const shell = ctx.createRadialGradient(cx + ox, cy + oy, radius * 0.5, cx + ox, cy + oy, radius * 1.28);
        shell.addColorStop(0, 'rgba(60, 130, 255, 0)');
        shell.addColorStop(0.52, `rgba(84, 160, 255, ${0.2 * now.glow})`);
        shell.addColorStop(0.7, `rgba(170, 215, 255, ${0.34 * now.glow})`);
        shell.addColorStop(0.84, `rgba(62, 128, 255, ${0.16 * now.glow})`);
        shell.addColorStop(1, 'rgba(30, 70, 200, 0)');
        ctx.fillStyle = shell; ctx.beginPath(); ctx.arc(cx + ox, cy + oy, radius * 1.3, 0, Math.PI * 2); ctx.fill();
      }

      const warm = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.72);
      warm.addColorStop(0, `rgba(255, 196, 128, ${0.5 * now.warm * now.glow})`);
      warm.addColorStop(0.55, `rgba(255, 138, 61, ${0.16 * now.warm * now.glow})`);
      warm.addColorStop(1, 'rgba(255, 120, 40, 0)');
      ctx.fillStyle = warm; ctx.beginPath(); ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2); ctx.fill();

      for (const seed of seeds) {
        const life = (seed.phase + t * seed.speed) % 1;
        const distance = radius * (1.02 + life * 2.4);
        const wobble = seed.angle + Math.sin(t * 0.4 + seed.phase * 9) * 0.08;
        const alpha = Math.sin(life * Math.PI) * 0.55 * now.glow;
        ctx.fillStyle = `rgba(170, 210, 255, ${alpha})`;
        ctx.beginPath(); ctx.arc(cx + Math.cos(wobble) * distance, cy + Math.sin(wobble) * distance, seed.size, 0, Math.PI * 2); ctx.fill();
      }

      if (now.rings > 0.02) {
        ctx.lineWidth = 1;
        for (let ring = 0; ring < 3; ring += 1) {
          const life = ((t * 0.16) + ring / 3) % 1;
          ctx.strokeStyle = `rgba(150, 200, 255, ${(1 - life) * 0.32 * now.rings})`;
          ctx.beginPath(); ctx.arc(cx, cy, radius * (1.2 + life * 3.2), 0, Math.PI * 2); ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.arc(cx, cy, Math.max(2, radius * 0.06), 0, Math.PI * 2); ctx.fill();
    };

    const loop = (time: number) => {
      if (!running) return;
      if (time - last > 30) { draw(time); last = time; }
      frame = requestAnimationFrame(loop);
    };
    const start = () => { cancelAnimationFrame(frame); if (reduced.matches) { draw(0); return; } running = true; frame = requestAnimationFrame(loop); };
    const onVisibility = () => { if (document.hidden) { running = false; cancelAnimationFrame(frame); } else start(); };
    const onResize = () => { resize(); draw(performance.now()); };
    const still = window.setInterval(() => { if (reduced.matches) draw(0); }, 400);

    resize(); start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', start);
    return () => { running = false; cancelAnimationFrame(frame); window.clearInterval(still); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVisibility); reduced.removeEventListener('change', start); };
  }, []);

  return <canvas ref={ref} className="lp-flame" aria-hidden="true" />;
}
