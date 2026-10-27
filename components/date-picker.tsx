// v2 DatePicker — form field + calendar popover. ISO date strings in/out
// (YYYY-MM-DD), zero timezone drama. Range variant (DateRangePicker)
// shares the calendar grid with a from/to selection model.
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import './date-picker.css';

/* ---------- Date helpers (local-TZ, no Date parsing from strings) ---------- */

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fromIso(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
function sameIso(a: Date, b: Date): boolean {
  return toIso(a) === toIso(b);
}
function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']; // Spanish Monday-start
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function monthGrid(month: Date): Date[] {
  const first = startOfMonth(month);
  // JS getDay(): 0=Sun ... 6=Sat. We want Monday-first, so weekdayOffset = (day+6)%7.
  const weekdayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - weekdayOffset);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return cells;
}

function fmtDisplay(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[d.getMonth()]!.slice(0, 3);
  return `${day} ${month} ${d.getFullYear()}`;
}

/* ---------- Shared calendar component ---------- */

function IconChevronLeft(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="10 4 6 8 10 12" />
    </svg>
  );
}
function IconChevronRight(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 4 10 8 6 12" />
    </svg>
  );
}
function IconCalendar(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

type CalendarProps = {
  month: Date;
  onMonthChange: (next: Date) => void;
  selectedIso?: string | null;
  rangeFromIso?: string | null;
  rangeToIso?: string | null;
  minIso?: string | null;
  maxIso?: string | null;
  onPick: (iso: string) => void;
};

function Calendar({
  month, onMonthChange, selectedIso, rangeFromIso, rangeToIso, minIso, maxIso, onPick,
}: CalendarProps): React.ReactElement {
  const today = new Date();
  const cells = monthGrid(month);
  const monthLabel = `${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`;

  function cellCls(d: Date): string {
    const iso = toIso(d);
    const otherMonth = d.getMonth() !== month.getMonth();
    const isToday = sameIso(d, today);
    const isSelected = selectedIso === iso;
    const inRange =
      rangeFromIso && rangeToIso && iso >= rangeFromIso && iso <= rangeToIso;
    const isRangeEdge = iso === rangeFromIso || iso === rangeToIso;
    const disabled =
      (minIso != null && iso < minIso) ||
      (maxIso != null && iso > maxIso);
    return [
      'ui-dp-cell',
      otherMonth && 'ui-dp-cell-other',
      isToday && 'ui-dp-cell-today',
      isSelected && 'ui-dp-cell-selected',
      inRange && 'ui-dp-cell-in-range',
      isRangeEdge && 'ui-dp-cell-range-edge',
      disabled && 'ui-dp-cell-disabled',
    ].filter(Boolean).join(' ');
  }

  return (
    <div className="ui-dp-calendar">
      <div className="ui-dp-nav">
        <button type="button" className="ui-dp-nav-btn" onClick={() => onMonthChange(addMonths(month, -1))} aria-label="Mes anterior">
          <IconChevronLeft />
        </button>
        <div className="ui-dp-month-label">{monthLabel}</div>
        <button type="button" className="ui-dp-nav-btn" onClick={() => onMonthChange(addMonths(month, 1))} aria-label="Mes siguiente">
          <IconChevronRight />
        </button>
      </div>

      <div className="ui-dp-weekrow">
        {WEEKDAYS.map((w) => (
          <span key={w} className="ui-dp-weekday">{w}</span>
        ))}
      </div>

      <div className="ui-dp-grid">
        {cells.map((d) => {
          const iso = toIso(d);
          return (
            <button
              key={iso}
              type="button"
              className={cellCls(d)}
              onClick={() => onPick(iso)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Single DatePicker ---------- */

export interface DatePickerProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  placeholder?: string;
  value: string | null;
  onChange: (next: string | null) => void;
  minIso?: string;
  maxIso?: string;
  disabled?: boolean;
  id?: string;
}

export function DatePicker({
  label, hint, errorMessage, placeholder = 'Elegir fecha…',
  value, onChange, minIso, maxIso, disabled = false, id,
}: DatePickerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => startOfMonth(fromIso(value) ?? new Date()));
  const rootRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const inputId = id ?? autoId;
  const date = fromIso(value);
  const hasError = !!errorMessage;

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent): void {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent): void { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open && value) setMonth(startOfMonth(fromIso(value) ?? new Date()));
  }, [open, value]);

  return (
    <div className="ui-field" ref={rootRef}>
      {label && <label className="ui-field-label" htmlFor={inputId}>{label}</label>}
      <div className="ui-dp">
        <button
          type="button"
          id={inputId}
          disabled={disabled}
          className={`ui-select ui-select-md ui-dp-trigger ${hasError ? 'ui-select-error' : ''} ${open ? 'ui-select-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="ui-dp-icon"><IconCalendar /></span>
          <span className={`ui-select-value ${!date ? 'ui-select-placeholder' : ''}`}>
            {date ? fmtDisplay(date) : placeholder}
          </span>
          {date && (
            <span
              className="ui-dp-clear"
              role="button"
              aria-label="Limpiar fecha"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
            >×</span>
          )}
        </button>
        {open && (
          <div className="ui-dp-popover" role="dialog">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              selectedIso={value}
              minIso={minIso}
              maxIso={maxIso}
              onPick={(iso) => { onChange(iso); setOpen(false); }}
            />
          </div>
        )}
      </div>
      {errorMessage ? (
        <div className="ui-field-error">{errorMessage}</div>
      ) : hint ? (
        <div className="ui-field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

/* ---------- DateRangePicker ---------- */

export interface DateRangePickerProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  value: { from: string | null; to: string | null };
  onChange: (next: { from: string | null; to: string | null }) => void;
  minIso?: string;
  maxIso?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  label, hint, value, onChange, minIso, maxIso, disabled = false,
}: DateRangePickerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => startOfMonth(fromIso(value.from) ?? new Date()));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent): void {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent): void { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const from = fromIso(value.from);
  const to = fromIso(value.to);
  const summary =
    from && to ? `${fmtDisplay(from)} → ${fmtDisplay(to)}`
    : from ? `${fmtDisplay(from)} → …`
    : 'Elegir rango…';

  function pick(iso: string): void {
    if (!value.from || (value.from && value.to)) {
      onChange({ from: iso, to: null });
    } else if (iso < value.from) {
      onChange({ from: iso, to: value.from });
      setOpen(false);
    } else {
      onChange({ from: value.from, to: iso });
      setOpen(false);
    }
  }

  return (
    <div className="ui-field" ref={rootRef}>
      {label && <label className="ui-field-label">{label}</label>}
      <div className="ui-dp">
        <button
          type="button"
          disabled={disabled}
          className={`ui-select ui-select-md ui-dp-trigger ${open ? 'ui-select-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="ui-dp-icon"><IconCalendar /></span>
          <span className={`ui-select-value ${!value.from ? 'ui-select-placeholder' : ''}`}>
            {summary}
          </span>
          {(value.from || value.to) && (
            <span
              className="ui-dp-clear"
              role="button"
              aria-label="Limpiar rango"
              onClick={(e) => { e.stopPropagation(); onChange({ from: null, to: null }); }}
            >×</span>
          )}
        </button>
        {open && (
          <div className="ui-dp-popover" role="dialog">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              rangeFromIso={value.from}
              rangeToIso={value.to}
              minIso={minIso}
              maxIso={maxIso}
              onPick={pick}
            />
          </div>
        )}
      </div>
      {hint && <div className="ui-field-hint">{hint}</div>}
    </div>
  );
}
