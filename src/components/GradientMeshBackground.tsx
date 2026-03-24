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
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const animate = () => {
      time += 0.002;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w(), h());

      // Deep base wash
      const baseGrad = ctx.createLinearGradient(0, 0, w(), h());
      baseGrad.addColorStop(0, "rgba(15, 10, 35, 0.4)");
      baseGrad.addColorStop(0.5, "rgba(8, 15, 40, 0.3)");
      baseGrad.addColorStop(1, "rgba(10, 8, 30, 0.4)");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w(), h());

      // Large ambient orbs — richer colors, more movement
      const orbs = [
        {
          x: w() * 0.2 + Math.sin(time * 0.6) * w() * 0.08,
          y: h() * 0.3 + Math.cos(time * 0.4) * h() * 0.06,
          r: Math.min(w(), h()) * 0.55,
          color: [130, 80, 230],
          opacity: 0.12,
        },
        {
          x: w() * 0.8 + Math.cos(time * 0.35) * w() * 0.07,
          y: h() * 0.5 + Math.sin(time * 0.3) * h() * 0.06,
          r: Math.min(w(), h()) * 0.5,
          color: [6, 182, 212],
          opacity: 0.09,
        },
        {
          x: w() * 0.5 + Math.sin(time * 0.5) * w() * 0.06,
          y: h() * 0.2 + Math.cos(time * 0.7) * h() * 0.05,
          r: Math.min(w(), h()) * 0.4,
          color: [100, 60, 220],
          opacity: 0.08,
        },
        {
          x: w() * 0.35 + Math.cos(time * 0.45) * w() * 0.05,
          y: h() * 0.7 + Math.sin(time * 0.55) * h() * 0.04,
          r: Math.min(w(), h()) * 0.35,
          color: [60, 100, 240],
          opacity: 0.07,
        },
      ];

      for (const orb of orbs) {
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, `rgba(${orb.color.join(",")}, ${orb.opacity})`);
        gradient.addColorStop(0.4, `rgba(${orb.color.join(",")}, ${orb.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${orb.color.join(",")}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w(), h());
      }

      // Central hero glow — AI energy core
      const coreX = w() * 0.5;
      const coreY = h() * 0.38;
      const corePulse = 0.7 + Math.sin(time * 1.5) * 0.3;
      const coreR = Math.min(w(), h()) * 0.3 * corePulse;
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreR);
      coreGrad.addColorStop(0, `rgba(140, 90, 255, ${0.08 * corePulse})`);
      coreGrad.addColorStop(0.5, `rgba(80, 60, 220, ${0.04 * corePulse})`);
      coreGrad.addColorStop(1, "rgba(80, 60, 220, 0)");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, w(), h());

      // Floating particles — more and varied
      for (let i = 0; i < 50; i++) {
        const speed = 0.15 + (i % 5) * 0.05;
        const px = (Math.sin(time * speed + i * 1.7) * 0.5 + 0.5) * w();
        const py = (Math.cos(time * (speed * 0.8) + i * 2.3) * 0.5 + 0.5) * h();
        const size = 0.5 + Math.sin(time * 0.8 + i) * 0.5 + (i % 3) * 0.3;
        const alpha = 0.12 + Math.sin(time * 1.2 + i * 0.6) * 0.08;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        const colors = [
          `rgba(6, 182, 212, ${alpha})`,
          `rgba(139, 92, 246, ${alpha})`,
          `rgba(99, 102, 241, ${alpha})`,
        ];
        ctx.fillStyle = colors[i % 3];
        ctx.fill();
      }

      // Subtle noise grain overlay
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      for (let i = 0; i < pixels.length; i += 16) {
        const noise = (Math.random() - 0.5) * 8;
        pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));
        pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise));
        pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

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
