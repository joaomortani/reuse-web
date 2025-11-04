import type { HTMLAttributes } from 'react';

const variantClass: Record<string, string> = {
  default: 'reuse-badge',
  success: 'reuse-badge reuse-badge--success',
  warning: 'reuse-badge reuse-badge--warning',
  info: 'reuse-badge reuse-badge--info',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantClass;
}

export const Badge = ({ variant = 'default', className = '', ...props }: BadgeProps) => {
  const classes = [variantClass[variant] ?? variantClass.default, className].filter(Boolean).join(' ');
  return <span className={classes} {...props} />;
};
