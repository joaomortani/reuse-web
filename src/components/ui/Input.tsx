'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
}

export const Input = ({ id, label, error, helperText, className = '', ...props }: InputProps) => {
  const inputId = id ?? props.name;

  return (
    <label className={`reuse-field ${className}`} htmlFor={inputId}>
      {label ? <span className="reuse-field__label">{label}</span> : null}
      <input id={inputId} className={`reuse-input${error ? ' reuse-input--error' : ''}`} {...props} />
      {helperText && !error ? <span className="reuse-field__helper">{helperText}</span> : null}
      {error ? (
        <span className="reuse-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
};
