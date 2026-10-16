/** Hand-drawn sage strokes. `pathLength=1` lets CSS draw them in with a dash offset. */
type Variant = 'portrait-loop' | 'underline';

const paths: Record<Variant, { viewBox: string; d: string }> = {
  'portrait-loop': {
    viewBox: '0 0 540 620',
    d: 'M30 540 C -5 400, 10 140, 150 55 C 270 -15, 470 25, 495 190 C 510 300, 480 360, 430 352 C 380 344, 385 286, 432 290 C 492 296, 506 430, 455 545',
  },
  underline: {
    viewBox: '0 0 220 24',
    d: 'M4 15 C 40 6, 80 20, 120 11 C 150 5, 180 8, 216 14',
  },
};

export function HandLine({ variant, className }: { variant: Variant; className?: string }) {
  const { viewBox, d } = paths[variant];
  return (
    <svg
      className={['hand-line', `hand-line--${variant}`, className].filter(Boolean).join(' ')}
      viewBox={viewBox}
      preserveAspectRatio={variant === 'underline' ? 'none' : 'xMidYMid meet'}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} pathLength={1} />
    </svg>
  );
}
