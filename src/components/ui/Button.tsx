'use client';

import { cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, PropsWithChildren, ReactElement } from 'react';

const baseClass = 'reuse-button';

const variants = {
  primary: `${baseClass} ${baseClass}--primary`,
  secondary: `${baseClass} ${baseClass}--secondary`,
  ghost: `${baseClass} ${baseClass}--ghost`,
};

const sizes = {
  md: `${baseClass}--md`,
  sm: `${baseClass}--sm`,
  lg: `${baseClass}--lg`,
};

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    loading?: boolean;
    asChild?: boolean;
  }
>;

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  asChild = false,
  ...props
}: ButtonProps) => {
  const classNames = [variants[variant] ?? variants.primary, sizes[size], className]
    .filter(Boolean)
    .join(' ');

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement;
    return cloneElement(child, {
      className: [classNames, child.props.className].filter(Boolean).join(' '),
    });
  }

  return (
    <button className={classNames} disabled={disabled || loading} {...props}>
      {loading ? <span className="spinner" aria-hidden /> : null}
      <span className={loading ? 'button__label button__label--hidden' : 'button__label'}>{children}</span>
    </button>
  );
};
