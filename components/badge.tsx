// v2 Badge — tag-like shape (8px radius, button-ish padding) matching the
// Button vocabulary. Supports leading dot, leading/trailing icons, and an
// optional × remove button for filter chips.

import './badge.css';

type BadgeColor = 'grey' | 'brand' | 'success' | 'warn' | 'error';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onRemove?: () => void;
}

export function Badge({
  color = 'grey',
  size = 'sm',
  dot = false,
  leadingIcon,
  trailingIcon,
  onRemove,
  children,
  className = '',
  ...rest
}: BadgeProps): React.ReactElement {
  const classes = [
    'ui-badge',
    `ui-badge-${color}`,
    `ui-badge-${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...rest}>
      {dot && <span className="ui-badge-dot" aria-hidden />}
      {leadingIcon && <span className="ui-badge-icon">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="ui-badge-icon">{trailingIcon}</span>}
      {onRemove && (
        <button
          type="button"
          className="ui-badge-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Quitar"
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" />
            <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" />
          </svg>
        </button>
      )}
    </span>
  );
}
