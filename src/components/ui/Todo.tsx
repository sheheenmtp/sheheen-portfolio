import type { ReactNode } from 'react';

/** A visible, clearly marked placeholder for content Sheheen still needs to supply. */
export function Todo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={['todo', className].filter(Boolean).join(' ')}>
      <span className="todo__tag">TODO:</span> {children}
    </p>
  );
}
