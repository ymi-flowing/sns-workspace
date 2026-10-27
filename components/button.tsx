// v2 Button — Untitled UI anatomy, NS brand colors.
// Hierarchies: primary · secondary · secondary-color · tertiary · tertiary-color · destructive
// Sizes:       sm (36h) · md (40h) · lg (44h) · xl (48h)
// Also supports leadingIcon / trailingIcon / iconOnly.

import './button.css';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonHierarchy = 'primary' | 'secondary' | 'secondary-color' | 'tertiary' | 'tertiary-color' | 'destructive';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  hierarchy?: ButtonHierarchy;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

export function Button({
  size = 'md',
  hierarchy = 'primary',
  leadingIcon,
  trailingIcon,
  iconOnly = false,
  fullWidth = false,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps): React.ReactElement {
  const classes = [
    'ui-btn',
    `ui-btn-${size}`,
    `ui-btn-${hierarchy}`,
    iconOnly && 'ui-btn-icon-only',
    fullWidth && 'ui-btn-full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {leadingIcon && <span className="ui-btn-icon">{leadingIcon}</span>}
      {!iconOnly && children}
      {iconOnly && leadingIcon == null && trailingIcon == null && children}
      {trailingIcon && <span className="ui-btn-icon">{trailingIcon}</span>}
    </button>
  );
}
