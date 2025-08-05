"use client";

import { useEffect, useRef, useState } from "react";

export function PostCreationAnimation({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = 600);
    const h = (canvas.height = 400);

    const centerX = w / 2;
    const centerY = h / 2;

    const postRect = {
      x: centerX - 150,
      y: centerY - 75,
      width: 300,
      height: 150,
    };

    const COLORS = [
      [255, 255, 255],
      [200, 220, 255],
      [135, 206, 250],
      [100, 149, 237],
      [70, 130, 180],
    ];

    const getColor = () => {
      const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
      return `rgb(${r}, ${g}, ${b})`;
    };

    const targetPoints: { x: number; y: number }[] = [];
    const gap = 15;

    for (
      let x = postRect.x + gap / 2;
      x < postRect.x + postRect.width;
      x += gap
    ) {
      for (
        let y = postRect.y + gap / 2;
        y < postRect.y + postRect.height;
        y += gap
      ) {
        targetPoints.push({ x, y });
      }
    }

    const particles = targetPoints.map(({ x: targetX, y: targetY }) => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = 150 + Math.random() * 100;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        r: 3 + Math.random() * 2,
        color: getColor(),
        vx: 0,
        vy: 0,
        alpha: 1,
        targetX,
        targetY,
        stuck: false,
      };
    });

    let finished = false;

    const draw = () => {
      if (finished) return;

      ctx.clearRect(0, 0, w, h);
      let allStuck = true;

      for (const p of particles) {
        if (!p.stuck) {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 2) {
            p.stuck = true;
            p.x = p.targetX;
            p.y = p.targetY;
          } else {
            const speed = 0.5;
            p.vx += (dx / dist) * speed;
            p.vy += (dy / dist) * speed;
            p.vx *= 0.82;
            p.vy *= 0.82;
            p.x += p.vx;
            p.y += p.vy;
            allStuck = false;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      if (!allStuck) {
        requestAnimationFrame(draw);
      } else {
        finished = true;

        setTimeout(() => {
          setDone(true);
          onComplete?.();
        }, 300);
      }
    };

    draw();
  }, [onComplete]);

  if (done) return null;

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-[600px] h-[400px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}