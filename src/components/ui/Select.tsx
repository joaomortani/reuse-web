'use client';

import type { SelectHTMLAttributes, ReactNode } from 'react';

interface Option {
  label: ReactNode;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = ({ id, label, error, options, placeholder, className = '', ...props }: SelectProps) => {
  const selectId = id ?? props.name;

  return (
    <label className={`reuse-field ${className}`} htmlFor={selectId}>
      {label ? <span className="reuse-field__label">{label}</span> : null}
      <select id={selectId} className={`reuse-input reuse-input--select${error ? ' reuse-input--error' : ''}`} {...props}>
        {placeholder ? (
          <option value="" disabled hidden={props.value !== undefined && props.value !== ''}>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="reuse-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
};
