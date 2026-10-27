'use client';

// v2 Toggle switch — iOS-style slider for binary settings.
// Sizes sm (32×20 track) · md (40×24 track).

import { useId } from 'react';
import './toggle.css';

type Size = 'sm' | 'md';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  size?: Size;
  /** Label position relative to the switch. Default: 'right'. */
  labelPosition?: 'left' | 'right';
}

export function Toggle({
  label,
  hint,
  size = 'sm',
  labelPosition = 'right',
  id,
  disabled,
  className = '',
  ...rest
}: ToggleProps): React.ReactElement {
  const autoId = useId();
  const inputId = id ?? autoId;

  const classes = [
    'ui-toggle',
    `ui-toggle-${size}`,
    disabled && 'ui-toggle-disabled',
    `ui-toggle-label-${labelPosition}`,
    className,
  ].filter(Boolean).join(' ');

  const switchEl = (
    <span className="ui-toggle-switch">
      <input id={inputId} type="checkbox" disabled={disabled} {...rest} />
      <span className="ui-toggle-track" aria-hidden>
        <span className="ui-toggle-thumb" />
      </span>
    </span>
  );
  const textEl = (label || hint) && (
    <span className="ui-toggle-text">
      {label && <span className="ui-toggle-label">{label}</span>}
      {hint && <span className="ui-toggle-hint">{hint}</span>}
    </span>
  );

  return (
    <label className={classes} htmlFor={inputId}>
      {labelPosition === 'left' ? (
        <>
          {textEl}
          {switchEl}
        </>
      ) : (
        <>
          {switchEl}
          {textEl}
        </>
      )}
    </label>
  );
}
