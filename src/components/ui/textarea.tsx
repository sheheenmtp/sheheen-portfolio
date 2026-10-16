import type { TextareaHTMLAttributes } from 'react';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={['field', 'field--area', className].filter(Boolean).join(' ')} {...props} />;
}
