// v2 Dropdown + Select — menu primitive and form-field select built on top.
//
// Dropdown: generic trigger + menu. Pass children (any JSX, rendered inside
//   an abs-positioned panel). Dismisses on click-outside / Esc. Good for
//   action menus ("Más acciones ▾") where items aren't a value picker.
//
// Select: form field. Looks like an Input, opens a Dropdown of options,
//   writes the chosen one back via onChange. Supports single + multi.
'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './select.css';

type Size = 'sm' | 'md';
type Align = 'left' | 'right';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: Align;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'left',
  open: controlledOpen,
  onOpenChange,
  className = '',
}: DropdownProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent): void {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent): void {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, setOpen]);

  return (
    <div className={`ui-dropdown ${className}`} ref={rootRef}>
      <div className="ui-dropdown-trigger" onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div className={`ui-dropdown-menu ui-dropdown-menu-${align}`} role="menu">
          {children}
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export function DropdownItem({
  leadingIcon,
  trailingIcon,
  danger = false,
  disabled = false,
  className = '',
  children,
  ...rest
}: DropdownItemProps): React.ReactElement {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={`ui-dropdown-item ${danger ? 'ui-dropdown-item-danger' : ''} ${className}`}
      {...rest}
    >
      {leadingIcon && <span className="ui-dropdown-item-icon">{leadingIcon}</span>}
      <span className="ui-dropdown-item-label">{children}</span>
      {trailingIcon && <span className="ui-dropdown-item-icon">{trailingIcon}</span>}
    </button>
  );
}

export function DropdownDivider(): React.ReactElement {
  return <div className="ui-dropdown-divider" aria-hidden />;
}

// ----- Select (form field) -----

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  placeholder?: string;
  size?: Size;
  options: SelectOption[];
  value: string | null;
  onChange: (next: string) => void;
  disabled?: boolean;
  id?: string;
  /** Show a search input at the top of the menu to filter options by label. */
  searchable?: boolean;
}

function IconChevronDown(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="4 6 8 10 12 6" />
    </svg>
  );
}
function IconCheck(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 8 7 12 13 4" />
    </svg>
  );
}
function IconSearch(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="7" cy="7" r="5" />
      <line x1="14" y1="14" x2="11" y2="11" />
    </svg>
  );
}

export function Select({
  label,
  hint,
  errorMessage,
  placeholder = 'Elegir…',
  size = 'md',
  options,
  value,
  onChange,
  disabled = false,
  id,
  searchable = false,
}: SelectProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const autoId = useId();
  const inputId = id ?? autoId;
  const selected = options.find((o) => o.value === value) ?? null;
  const hasError = !!errorMessage;

  // Reset search when menu closes.
  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const filtered = searchable && query
    ? options.filter((o) =>
        String(typeof o.label === 'string' ? o.label : o.value).toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            type="button"
            id={inputId}
            disabled={disabled}
            className={`ui-select ui-select-${size} ${hasError ? 'ui-select-error' : ''} ${open ? 'ui-select-open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className={`ui-select-value ${!selected ? 'ui-select-placeholder' : ''}`}>
              {selected ? selected.label : placeholder}
            </span>
            <span className="ui-select-caret" aria-hidden>
              <IconChevronDown />
            </span>
          </button>
        }
      >
        {searchable && (
          <div className="ui-select-search">
            <IconSearch />
            <input
              type="search"
              autoFocus
              placeholder="Buscar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
        <ul className="ui-select-list" role="listbox">
          {filtered.length === 0 ? (
            <li className="ui-select-empty">Sin resultados</li>
          ) : (
            filtered.map((opt) => {
              const current = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={current}
                  className={`ui-select-option ${current ? 'ui-select-option-current' : ''} ${opt.disabled ? 'ui-select-option-disabled' : ''}`}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <div className="ui-select-option-text">
                    <span className="ui-select-option-label">{opt.label}</span>
                    {opt.hint && <span className="ui-select-option-hint">{opt.hint}</span>}
                  </div>
                  {current && <span className="ui-select-option-check"><IconCheck /></span>}
                </li>
              );
            })
          )}
        </ul>
      </Dropdown>
      {errorMessage ? (
        <div className="ui-field-error">{errorMessage}</div>
      ) : hint ? (
        <div className="ui-field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

// ----- MultiSelect (form field, picks N) -----

export interface MultiSelectProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  placeholder?: string;
  options: SelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  searchable?: boolean;
  /** Show "Seleccionar todo" + "Limpiar" action buttons above the list. */
  showSelectAll?: boolean;
  /** Render selected values as removable chips in the trigger instead of
   *  the "N seleccionados" summary. Great for filter rows. */
  chips?: boolean;
  /** When using chips, cap how many render before collapsing to "+N más". */
  maxChips?: number;
}

export function MultiSelect({
  label,
  hint,
  placeholder = 'Elegir…',
  options,
  value,
  onChange,
  disabled = false,
  searchable = false,
  showSelectAll = false,
  chips = false,
  maxChips = 4,
}: MultiSelectProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const summary =
    value.length === 0 ? placeholder
    : value.length === 1 ? (options.find((o) => o.value === value[0])?.label ?? value[0])
    : `${value.length} seleccionados`;

  const filtered = searchable && query
    ? options.filter((o) =>
        String(typeof o.label === 'string' ? o.label : o.value).toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  function toggle(v: string): void {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  function selectAllVisible(): void {
    const toAdd = filtered.filter((o) => !o.disabled && !value.includes(o.value)).map((o) => o.value);
    onChange([...value, ...toAdd]);
  }
  function clearAll(): void {
    onChange([]);
  }

  const allVisibleSelected = filtered.length > 0 && filtered.every((o) => value.includes(o.value) || o.disabled);

  return (
    <div className="ui-field">
      {label && <label className="ui-field-label">{label}</label>}
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            type="button"
            disabled={disabled}
            className={`ui-select ui-select-md ${open ? 'ui-select-open' : ''} ${chips && value.length > 0 ? 'ui-select-chips' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {chips && value.length > 0 ? (
              <span className="ui-select-chip-row">
                {value.slice(0, maxChips).map((v) => {
                  const opt = options.find((o) => o.value === v);
                  const lbl = opt?.label ?? v;
                  return (
                    <span key={v} className="ui-select-chip">
                      <span className="ui-select-chip-label">{lbl}</span>
                      <span
                        role="button"
                        aria-label="Quitar"
                        className="ui-select-chip-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(value.filter((x) => x !== v));
                        }}
                      >×</span>
                    </span>
                  );
                })}
                {value.length > maxChips && (
                  <span className="ui-select-chip-more">+{value.length - maxChips} más</span>
                )}
              </span>
            ) : (
              <span className={`ui-select-value ${value.length === 0 ? 'ui-select-placeholder' : ''}`}>
                {summary}
              </span>
            )}
            <span className="ui-select-caret" aria-hidden>
              <IconChevronDown />
            </span>
          </button>
        }
      >
        {searchable && (
          <div className="ui-select-search">
            <IconSearch />
            <input
              type="search"
              autoFocus
              placeholder="Buscar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
        {showSelectAll && (
          <div className="ui-select-actions">
            <button
              type="button"
              className="ui-select-action"
              onClick={selectAllVisible}
              disabled={allVisibleSelected || filtered.length === 0}
            >
              Seleccionar todo{filtered.length !== options.length ? ` (${filtered.length})` : ''}
            </button>
            <button
              type="button"
              className="ui-select-action"
              onClick={clearAll}
              disabled={value.length === 0}
            >
              Limpiar
            </button>
          </div>
        )}
        <ul className="ui-select-list" role="listbox" aria-multiselectable>
          {filtered.length === 0 ? (
            <li className="ui-select-empty">Sin resultados</li>
          ) : (
            filtered.map((opt) => {
              const current = value.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={current}
                  className={`ui-select-option ${current ? 'ui-select-option-current' : ''} ${opt.disabled ? 'ui-select-option-disabled' : ''}`}
                  onClick={() => {
                    if (opt.disabled) return;
                    toggle(opt.value);
                  }}
                >
                  <div className="ui-select-option-text">
                    <span className="ui-select-option-label">{opt.label}</span>
                    {opt.hint && <span className="ui-select-option-hint">{opt.hint}</span>}
                  </div>
                  {current && <span className="ui-select-option-check"><IconCheck /></span>}
                </li>
              );
            })
          )}
        </ul>
      </Dropdown>
      {hint && <div className="ui-field-hint">{hint}</div>}
    </div>
  );
}
