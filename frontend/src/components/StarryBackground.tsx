import { useEffect, useRef } from 'react';

interface StarryBackgroundProps {
  density?: number;
}

export function StarryBackground({ density = 0.5 }: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      stars.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 3000 * density);
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.3 + 0.1
        });
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, index) => {
        star.opacity += Math.sin(Date.now() * 0.001 + index) * 0.01;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (star.size > 1.5) {
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          gradient.addColorStop(0, `rgba(147, 197, 253, ${star.opacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    />
  );
}
