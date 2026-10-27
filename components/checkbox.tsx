'use client';

// v2 Checkbox + Radio + RadioGroup — Untitled UI anatomy.
// Checkbox supports indeterminate via a ref effect. Radio comes with a
// RadioGroup wrapper that owns `name` + `value` + `onChange`. Both come
// in sm (16px) and md (20px).

import { useEffect, useId, useRef } from 'react';
import './checkbox.css';

type Size = 'sm' | 'md';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  size?: Size;
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  hint,
  size = 'sm',
  indeterminate = false,
  className = '',
  id,
  disabled,
  ...rest
}: CheckboxProps): React.ReactElement {
  const ref = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const inputId = id ?? autoId;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const classes = [
    'ui-check',
    `ui-check-${size}`,
    disabled && 'ui-check-disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={inputId}>
      <span className="ui-check-input-wrap">
        <input ref={ref} id={inputId} type="checkbox" disabled={disabled} {...rest} />
        <span className="ui-check-box" aria-hidden>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="2.5 6.5 5 9 9.5 3.5" className="ui-check-tick" />
            <line x1="3" y1="6" x2="9" y2="6" className="ui-check-dash" />
          </svg>
        </span>
      </span>
      {(label || hint) && (
        <span className="ui-check-text">
          {label && <span className="ui-check-label">{label}</span>}
          {hint && <span className="ui-check-hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (next: string) => void;
  options: RadioOption[];
  label?: React.ReactNode;
  size?: Size;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  size = 'sm',
  orientation = 'vertical',
}: RadioGroupProps): React.ReactElement {
  return (
    <fieldset className="ui-radio-group">
      {label && <legend className="ui-radio-legend">{label}</legend>}
      <div className={`ui-radio-list ui-radio-list-${orientation}`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`ui-radio ui-radio-${size} ${opt.disabled ? 'ui-radio-disabled' : ''}`}
          >
            <span className="ui-radio-input-wrap">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
              />
              <span className="ui-radio-dot" aria-hidden />
            </span>
            <span className="ui-radio-text">
              <span className="ui-radio-label">{opt.label}</span>
              {opt.hint && <span className="ui-radio-hint">{opt.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
