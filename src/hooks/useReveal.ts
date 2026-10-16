import { useEffect } from 'react';

/**
 * Adds `is-visible` to elements as they scroll into view.
 * - `.reveal`: the element itself fades up (hidden by CSS only when JS runs and motion is allowed).
 * - `.reveal-late`: never hidden itself; it triggers child animations (pipeline steps,
 *   handwritten notes) once a larger share of it is on screen.
 * Content stays visible if this never runs.
 */
export function useReveal() {
  useEffect(() => {
    const groups: [string, IntersectionObserverInit][] = [
      ['.reveal', { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }],
      ['.reveal-late', { rootMargin: '0px 0px -15% 0px', threshold: 0.45 }],
    ];
    if (!('IntersectionObserver' in window)) {
      groups.forEach(([selector]) =>
        document.querySelectorAll(selector).forEach((el) => el.classList.add('is-visible')),
      );
      return;
    }
    const observers = groups.map(([selector, options]) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, options);
      document.querySelectorAll(selector).forEach((el) => observer.observe(el));
      return observer;
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);
}
