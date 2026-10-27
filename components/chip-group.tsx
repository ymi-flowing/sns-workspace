// v2 ChipGroup — flat row of pill-shaped toggle chips. Use when the options
// are a short, visible set and you want the user to see every choice at a
// glance ("Choose property features" style). For long lists or filter bars,
// prefer MultiSelect with chips in the trigger.

import './chip-group.css';

type Size = 'sm' | 'md';

export interface ChipOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ChipGroupProps<V extends string = string> {
  options: ChipOption<V>[];
  value: V[];
  onChange: (next: V[]) => void;
  /** Set true to constrain to a single selection (behaves like a radio pill row). */
  single?: boolean;
  size?: Size;
  label?: React.ReactNode;
  /** Show selected summary under the row ("Selected: Pet Friendly, Gym"). */
  showSelected?: boolean;
  className?: string;
}

export function ChipGroup<V extends string = string>({
  options,
  value,
  onChange,
  single = false,
  size = 'md',
  label,
  showSelected = false,
  className = '',
}: ChipGroupProps<V>): React.ReactElement {
  function toggle(v: V): void {
    if (single) {
      onChange([v]);
      return;
    }
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as React.ReactNode[];

  return (
    <div className={`ui-chipgroup ${className}`}>
      {label && <div className="ui-chipgroup-label">{label}</div>}
      <div
        role={single ? 'radiogroup' : 'group'}
        className={`ui-chipgroup-row ui-chipgroup-${size}`}
      >
        {options.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              role={single ? 'radio' : 'button'}
              aria-checked={single ? active : undefined}
              aria-pressed={!single ? active : undefined}
              disabled={opt.disabled}
              onClick={() => toggle(opt.value)}
              className={`ui-chip ${active ? 'ui-chip-active' : ''}`}
            >
              {opt.icon && <span className="ui-chip-icon">{opt.icon}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
      {showSelected && (
        <div className="ui-chipgroup-summary">
          {selectedLabels.length === 0 ? (
            <span>Nada seleccionado</span>
          ) : (
            <>
              <span className="ui-chipgroup-summary-label">Seleccionado:</span>{' '}
              <span>{selectedLabels.map((l, i) => (<span key={i}>{i > 0 ? ', ' : ''}{l}</span>))}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
