"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/context/ThemeContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isAccent: boolean;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export function MotionBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse for subtle ambient interaction
    let mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Particle Configuration
    const particleCount = Math.min(Math.floor((width * height) / 28000), 55);
    let particles: Particle[] = [];

    const isDark = theme === "dark";

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const isAccent = i % 4 === 0; // 25% are Ferrari Red sparks
        const radius = isAccent ? Math.random() * 2.2 + 1.2 : Math.random() * 1.5 + 0.8;
        
        let color: string;
        if (isDark) {
          color = isAccent ? "rgba(255, 30, 30, 0.75)" : "rgba(255, 255, 255, 0.25)";
        } else {
          color = isAccent ? "rgba(255, 30, 30, 0.55)" : "rgba(20, 20, 25, 0.2)";
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius,
          color,
          isAccent,
          alpha: Math.random() * 0.5 + 0.5,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    let time = 0;
    let isRunning = true;

    const handleVisibilityChange = () => {
      isRunning = !document.hidden;
      if (isRunning) {
        render();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isRunning) return;
      time += 0.02;

      ctx.clearRect(0, 0, width, height);

      // Subtle ambient background radial spotlight
      const ambientGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        0,
        width * 0.5,
        height * 0.25,
        width * 0.65
      );
      if (isDark) {
        ambientGrad.addColorStop(0, "rgba(255, 30, 30, 0.05)");
        ambientGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      } else {
        ambientGrad.addColorStop(0, "rgba(255, 30, 30, 0.035)");
        ambientGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse gentle repel / drift
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Pulse alpha
        const currentAlpha =
          p.alpha * (0.8 + 0.2 * Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isAccent
          ? isDark
            ? `rgba(255, 30, 30, ${currentAlpha})`
            : `rgba(255, 30, 30, ${currentAlpha * 0.75})`
          : isDark
          ? `rgba(255, 255, 255, ${currentAlpha * 0.4})`
          : `rgba(20, 20, 25, ${currentAlpha * 0.25})`;

        if (p.isAccent && isDark) {
          ctx.shadowColor = "rgba(255, 30, 30, 0.6)";
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = 120;

          if (distNodes < maxDist) {
            const lineAlpha = (1 - distNodes / maxDist) * (isDark ? 0.12 : 0.06);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle =
              p.isAccent || p2.isAccent
                ? `rgba(255, 30, 30, ${lineAlpha * 1.5})`
                : isDark
                ? `rgba(255, 255, 255, ${lineAlpha})`
                : `rgba(0, 0, 0, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
