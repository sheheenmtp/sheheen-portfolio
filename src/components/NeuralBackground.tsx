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
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let lastFrameTime = 0;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targetFrameTime = 1000 / 30;

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resizeCanvas();

    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    const nodeCount = window.innerWidth < 768 ? 22 : 38;
    const nodeColor = isLight ? 'rgba(29, 78, 216, 0.88)' : 'rgba(96, 165, 250, 0.86)';
    const connectionColor = isLight ? '37, 99, 235' : '59, 130, 246';
    const connectionDistance = 175;
    const connectionDistanceSquared = connectionDistance * connectionDistance;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
      });
    }

    const drawFrame = (updateNodes: boolean) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      nodes.forEach((node, i) => {
        if (updateNodes) {
          node.x += node.vx;
          node.y += node.vy;
        }

        if (node.x < 0) node.x = viewportWidth;
        if (node.x > viewportWidth) node.x = 0;
        if (node.y < 0) node.y = viewportHeight;
        if (node.y > viewportHeight) node.y = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, isLight ? 2.5 : 2.3, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        for (let otherIndex = i + 1; otherIndex < nodes.length; otherIndex += 1) {
          const otherNode = nodes[otherIndex];
          const deltaX = node.x - otherNode.x;
          const deltaY = node.y - otherNode.y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;

          if (distanceSquared < connectionDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            const opacity = (isLight ? 0.38 : 0.34) - distance / (isLight ? 820 : 760);
            ctx.strokeStyle = `rgba(${connectionColor}, ${Math.max(opacity, isLight ? 0.14 : 0.1)})`;
            ctx.lineWidth = isLight ? 1.2 : 1.1;
            ctx.stroke();
          }
        }
      });
    };

    function animate(timestamp: number) {
      if (document.hidden || prefersReducedMotion) return;

      if (timestamp - lastFrameTime >= targetFrameTime) {
        drawFrame(true);
        lastFrameTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    const startAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      lastFrameTime = 0;

      if (prefersReducedMotion) {
        drawFrame(false);
      } else if (!document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      resizeCanvas();
      if (prefersReducedMotion) drawFrame(false);
    };

    const handleVisibilityChange = () => startAnimation();
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      startAnimation();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionPreference.addEventListener('change', handleMotionPreference);
    startAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionPreference.removeEventListener('change', handleMotionPreference);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        background: isLight
          ? 'linear-gradient(135deg, #f5f8ff 0%, #e8f0ff 52%, #f1efff 100%)'
          : 'linear-gradient(135deg, #050916 0%, #0b1730 100%)',
        transition: 'background 300ms ease',
      }}
    />
  );
}
