import { useEffect, type RefObject } from 'react';

/**
 * Fills the Path timeline as the reader scrolls: sets `--progress` (0 to 1) on the list
 * and marks each item `is-reached` once its dot passes 55% of the viewport height.
 */
export function useTimelineProgress(listRef: RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>('.timeline__item'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.55;
      const box = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (marker - box.top) / box.height));
      list.style.setProperty('--progress', progress.toFixed(4));
      items.forEach((item) => {
        item.classList.toggle('is-reached', item.getBoundingClientRect().top + 12 <= marker);
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [listRef]);
}
