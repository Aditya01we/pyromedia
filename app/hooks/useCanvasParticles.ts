'use client';

import { useEffect, useRef } from 'react';

export const useCanvasParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      vx: number;
      vy: number;
    }> = [];
    let dpr = 1;
    let animationFrameId: number;

    function initParticles() {
      particles = [];
      const numSpeckles = Math.floor(
        (window.innerWidth * window.innerHeight) / 4000
      );

      for (let i = 0; i < numSpeckles; i++) {
        let x: number;
        const edgeBias = Math.random();
        if (edgeBias < 0.4) {
          x = Math.random() * (window.innerWidth * 0.3);
        } else if (edgeBias < 0.8) {
          x = window.innerWidth - Math.random() * (window.innerWidth * 0.3);
        } else {
          x = window.innerWidth * 0.3 + Math.random() * (window.innerWidth * 0.4);
        }

        const y = Math.random() * window.innerHeight;
        let radius = Math.random() * 1.5;
        if (Math.random() > 0.95) radius = Math.random() * 3.5 + 1;

        const alpha = Math.random() * 0.8 + 0.2;
        const vx = (Math.random() - 0.5) * 1.2;
        const vy = -Math.random() * 0.5 - 0.6;

        particles.push({ x, y, radius, alpha, vx, vy });
      }
    }

    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function animate() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y + p.radius < 0) p.y = window.innerHeight + p.radius;
        if (p.x > window.innerWidth + p.radius) p.x = -p.radius;
        else if (p.x < -p.radius) p.x = window.innerWidth + p.radius;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return canvasRef;
};
