'use client';

import type { ReactNode, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
}

export const Textarea = ({ id, label, error, helperText, className = '', ...props }: TextareaProps) => {
  const textId = id ?? props.name;

  return (
    <label className={`reuse-field ${className}`} htmlFor={textId}>
      {label ? <span className="reuse-field__label">{label}</span> : null}
      <textarea id={textId} className={`reuse-input reuse-input--textarea${error ? ' reuse-input--error' : ''}`} {...props} />
      {helperText && !error ? <span className="reuse-field__helper">{helperText}</span> : null}
      {error ? (
        <span className="reuse-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
};
