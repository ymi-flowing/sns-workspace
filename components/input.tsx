// v2 Input + Textarea — Untitled UI anatomy, NS brand colors.
// Both components support an optional label/hint/errorMessage trio that
// gets rendered around the field. Pass errorMessage to switch into the
// red error state. Keep it pure HTML — no form framework coupling.

import './input.css';

type Size = 'sm' | 'md';

type FieldWrapperProps = {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
};

function FieldWrapper({ label, hint, errorMessage, htmlFor, children }: FieldWrapperProps): React.ReactElement {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {errorMessage ? (
        <div className="ui-field-error">{errorMessage}</div>
      ) : hint ? (
        <div className="ui-field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: Size;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Short piece of static text pinned to the start of the field (e.g. "$"). */
  prefix?: React.ReactNode;
  /** Short piece of static text pinned to the end of the field (e.g. ".com"). */
  suffix?: React.ReactNode;
}

export function Input({
  size = 'md',
  label,
  hint,
  errorMessage,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  className = '',
  id,
  ...rest
}: InputProps): React.ReactElement {
  const hasError = !!errorMessage;
  const groupClasses = [
    'ui-input-group',
    `ui-input-${size}`,
    hasError && 'ui-input-error',
    rest.disabled && 'ui-input-disabled',
    leadingIcon && 'ui-input-with-leading',
    trailingIcon && 'ui-input-with-trailing',
    prefix && 'ui-input-with-prefix',
    suffix && 'ui-input-with-suffix',
    className,
  ].filter(Boolean).join(' ');

  return (
    <FieldWrapper label={label} hint={hint} errorMessage={errorMessage} htmlFor={id}>
      <div className={groupClasses}>
        {leadingIcon && <span className="ui-input-affix ui-input-affix-leading">{leadingIcon}</span>}
        {prefix && <span className="ui-input-text ui-input-text-leading">{prefix}</span>}
        <input id={id} className="ui-input" {...rest} />
        {suffix && <span className="ui-input-text ui-input-text-trailing">{suffix}</span>}
        {trailingIcon && <span className="ui-input-affix ui-input-affix-trailing">{trailingIcon}</span>}
      </div>
    </FieldWrapper>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

export function Textarea({
  label,
  hint,
  errorMessage,
  className = '',
  id,
  rows = 4,
  ...rest
}: TextareaProps): React.ReactElement {
  const hasError = !!errorMessage;
  const classes = [
    'ui-textarea',
    hasError && 'ui-textarea-error',
    rest.disabled && 'ui-textarea-disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <FieldWrapper label={label} hint={hint} errorMessage={errorMessage} htmlFor={id}>
      <textarea id={id} className={classes} rows={rows} {...rest} />
    </FieldWrapper>
  );
}
