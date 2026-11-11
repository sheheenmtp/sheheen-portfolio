import { useEffect, useState, useSyncExternalStore } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * Gemini streams an answer in a few large chunks. This reveals `text` a little every
 * frame instead, moving faster the further it lags behind, so bursts read as a steady
 * flow. Returns the full text at once when `smooth` is false.
 */
export function useSmoothText(text: string, smooth: boolean) {
  // Text that already exists when the component mounts is shown immediately.
  const [count, setCount] = useState(text.length);
  const target = text.length;

  useEffect(() => {
    if (!smooth || count >= target) return;
    const frame = requestAnimationFrame(() => {
      setCount((current) => Math.min(target, current + Math.max(2, Math.ceil((target - current) / 40))));
    });
    return () => cancelAnimationFrame(frame);
  }, [count, target, smooth]);

  return smooth ? text.slice(0, Math.min(count, target)) : text;
}
