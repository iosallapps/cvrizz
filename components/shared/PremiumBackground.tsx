"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PremiumBackgroundProps {
  variant?: "default" | "subtle" | "auth";
  showParticles?: boolean;
}

export function PremiumBackground({
  variant = "default",
  showParticles = true
}: PremiumBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    if (showParticles) {
      const newParticles = Array.from({ length: variant === "auth" ? 15 : 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
      }));
      setParticles(newParticles);
    }
  }, [showParticles, variant]);

  const orbOpacity = variant === "subtle" ? 0.15 : variant === "auth" ? 0.25 : 0.2;
  const orbScale = variant === "auth" ? 0.8 : 1;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 -left-1/4 w-[800px] h-[800px] rounded-full"
        style={{
          background: `radial-gradient(circle, oklch(0.63 0.19 250 / ${orbOpacity}) 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, oklch(0.63 0.23 295 / ${orbOpacity}) 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] rounded-full"
        style={{
          background: `radial-gradient(circle, oklch(0.64 0.17 145 / ${orbOpacity * 0.7}) 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating particles */}
      {showParticles && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
