// v2 SegmentedControl + ToggleButtonGroup — two visually distinct patterns
// for picking from a short list of options.
//
// SegmentedControl: iOS-style pill with equal-width options, selected one
//   gets a filled bg card. Always single-select. Use for mode switches
//   (Auto / Interior / BA, Day / Week / Month, etc.).
//
// ToggleButtonGroup: a row of outlined buttons that share borders (like a
//   bordered rect split by vertical dividers). Can be single OR multi.
//   Use for filter chip rows where options are peers (e.g. day-of-week
//   picker, size selector).

import './segmented.css';

type Size = 'sm' | 'md';

export interface SegmentOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<V extends string = string> {
  options: SegmentOption<V>[];
  value: V;
  onChange: (next: V) => void;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<V extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
  fullWidth = false,
  className = '',
}: SegmentedControlProps<V>): React.ReactElement {
  return (
    <div
      role="radiogroup"
      className={`ui-seg ui-seg-${size} ${fullWidth ? 'ui-seg-full' : ''} ${className}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={opt.disabled}
            className={`ui-seg-btn ${active ? 'ui-seg-btn-active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon && <span className="ui-seg-icon">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ----- ToggleButtonGroup -----

export interface ToggleButtonGroupProps<V extends string = string> {
  options: SegmentOption<V>[];
  value: V | V[];
  onChange: (next: V | V[]) => void;
  size?: Size;
  multiple?: boolean;
  className?: string;
}

export function ToggleButtonGroup<V extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
  multiple = false,
  className = '',
}: ToggleButtonGroupProps<V>): React.ReactElement {
  function isActive(v: V): boolean {
    return multiple ? (value as V[]).includes(v) : value === v;
  }
  function toggle(v: V): void {
    if (multiple) {
      const current = value as V[];
      onChange(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
    } else {
      onChange(v as V);
    }
  }

  return (
    <div
      role={multiple ? 'group' : 'radiogroup'}
      className={`ui-tbg ui-tbg-${size} ${className}`}
    >
      {options.map((opt) => {
        const active = isActive(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={multiple ? 'button' : 'radio'}
            aria-checked={!multiple ? active : undefined}
            aria-pressed={multiple ? active : undefined}
            disabled={opt.disabled}
            className={`ui-tbg-btn ${active ? 'ui-tbg-btn-active' : ''}`}
            onClick={() => toggle(opt.value)}
          >
            {opt.icon && <span className="ui-tbg-icon">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
