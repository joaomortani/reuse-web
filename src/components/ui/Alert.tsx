import type { PropsWithChildren } from 'react';

const variants = {
  info: 'reuse-alert',
  success: 'reuse-alert reuse-alert--success',
  danger: 'reuse-alert reuse-alert--danger',
  warning: 'reuse-alert reuse-alert--warning',
};

interface AlertProps {
  variant?: keyof typeof variants;
  title?: string;
}

export const Alert = ({ children, variant = 'info', title }: PropsWithChildren<AlertProps>) => (
  <div className={variants[variant] ?? variants.info} role="status">
    {title ? <strong className="reuse-alert__title">{title}</strong> : null}
    <div className="reuse-alert__content">{children}</div>
  </div>
);
