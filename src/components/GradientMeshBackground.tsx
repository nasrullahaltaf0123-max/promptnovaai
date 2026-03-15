import { useEffect, useRef } from "react";

const GradientMeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const animate = () => {
      time += 0.003;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w(), h());

      // Large ambient orbs — very subtle, Apple-like
      const orbs = [
        {
          x: w() * 0.25 + Math.sin(time * 0.8) * w() * 0.05,
          y: h() * 0.35 + Math.cos(time * 0.6) * h() * 0.04,
          r: Math.min(w(), h()) * 0.5,
          color: [120, 80, 220],
          opacity: 0.08,
        },
        {
          x: w() * 0.75 + Math.cos(time * 0.5) * w() * 0.06,
          y: h() * 0.55 + Math.sin(time * 0.4) * h() * 0.05,
          r: Math.min(w(), h()) * 0.45,
          color: [6, 182, 212],
          opacity: 0.06,
        },
        {
          x: w() * 0.5 + Math.sin(time * 0.7) * w() * 0.04,
          y: h() * 0.25 + Math.cos(time * 0.9) * h() * 0.03,
          r: Math.min(w(), h()) * 0.35,
          color: [100, 60, 200],
          opacity: 0.05,
        },
      ];

      for (const orb of orbs) {
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, `rgba(${orb.color.join(",")}, ${orb.opacity})`);
        gradient.addColorStop(0.5, `rgba(${orb.color.join(",")}, ${orb.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${orb.color.join(",")}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w(), h());
      }

      // Subtle floating particles
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(time * 0.3 + i * 1.7) * 0.5 + 0.5) * w();
        const py = (Math.cos(time * 0.2 + i * 2.3) * 0.5 + 0.5) * h();
        const size = 0.8 + Math.sin(time + i) * 0.4;
        const alpha = 0.15 + Math.sin(time * 1.5 + i * 0.8) * 0.1;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0
          ? `rgba(6, 182, 212, ${alpha})`
          : `rgba(139, 92, 246, ${alpha})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default GradientMeshBackground;
