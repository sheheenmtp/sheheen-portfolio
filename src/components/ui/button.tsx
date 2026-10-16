import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type Variant = 'solid' | 'text';

const classFor = (variant: Variant, className?: string) =>
  ['btn', `btn--${variant}`, className].filter(Boolean).join(' ');

export function Button({
  variant = 'solid',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={classFor(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = 'solid',
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={classFor(variant, className)} {...props} />;
}
