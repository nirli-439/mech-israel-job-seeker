
import React, { useEffect, useRef } from "react";

interface Ball {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
}

interface BallpitBackgroundProps {
  amount?: number;
  colors?: string[];
}

const BallpitBackground: React.FC<BallpitBackgroundProps> = ({
  amount = 60,
  colors = ["#FF6B6B", "#F7B801", "#6BCB77", "#4D96FF"],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const ballsRef = useRef<Ball[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBalls = () => {
      const balls: Ball[] = [];
      const width = canvas.width;
      const height = canvas.height;
      for (let i = 0; i < amount; i++) {
        const r = Math.random() * 20 + 5;
        const x = Math.random() * (width - 2 * r) + r;
        const y = Math.random() * (height - 2 * r) + r;
        const vx = (Math.random() * 1 - 0.5) * 2;
        const vy = (Math.random() * 1 - 0.5) * 2;
        const color = colors[i % colors.length];
        balls.push({ x, y, r, vx, vy, color });
      }
      ballsRef.current = balls;
    };

    const draw = () => {
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      for (const ball of ballsRef.current) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x + ball.r > width || ball.x - ball.r < 0) {
          ball.vx *= -1;
        }
        if (ball.y + ball.r > height || ball.y - ball.r < 0) {
          ball.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    createBalls();
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [amount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -10 }}
    />
  );
};

export default BallpitBackground;
