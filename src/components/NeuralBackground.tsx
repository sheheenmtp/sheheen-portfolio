import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    const nodeCount = window.innerWidth < 768 ? 30 : 50;
    const nodeColor = isLight ? 'rgba(29, 78, 216, 0.78)' : 'rgba(59, 130, 246, 0.6)';
    const connectionColor = isLight ? '37, 99, 235' : '59, 130, 246';

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, isLight ? 2.4 : 2, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw connections
        nodes.slice(i + 1).forEach(otherNode => {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            const opacity = (isLight ? 0.34 : 0.3) - distance / (isLight ? 700 : 500);
            ctx.strokeStyle = `rgba(${connectionColor}, ${Math.max(opacity, isLight ? 0.1 : 0.03)})`;
            ctx.lineWidth = isLight ? 1.2 : 1;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        background: isLight
          ? 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 52%, #ede9fe 100%)'
          : 'linear-gradient(135deg, #020817 0%, #0f172a 100%)',
        transition: 'background 300ms ease',
      }}
    />
  );
}
