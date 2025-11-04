import type { HTMLAttributes } from 'react';

export const Spinner = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`reuse-spinner ${className}`} role="status" aria-live="polite" {...props}>
    <span className="sr-only">Carregando...</span>
  </div>
);
