// v2 StatusBadge — a Badge wearing the current status, with a trailing
// chevron and a click-to-open dropdown of the 5 pipeline statuses.
//
// The menu renders via a React portal into document.body so it escapes
// any ancestor overflow:auto (table scroll areas, modal body, cards).
// Position is computed from the trigger's bounding rect every time it
// opens, and re-closed on scroll so it never drifts.
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from './badge';
import './status-badge.css';

// Read the live data-theme from the nearest ancestor .ui-scope at open time
// so the portaled menu doesn't drift from the theme when the user toggles it.
function readScopeTheme(el: Element | null): 'light' | undefined {
  for (let n = el as HTMLElement | null; n; n = n.parentElement) {
    if (n.classList?.contains('ui-scope')) {
      return (n.getAttribute('data-theme') === 'light' ? 'light' : undefined);
    }
  }
  return undefined;
}

// SNS applicant lifecycle (ResMan Pending/Pending Transfer leases + their outcomes).
// Pending → Approved → Signed is the happy path; Denied / Cancelled are terminal.
export type PipelineStatus =
  | 'pending'
  | 'approved'
  | 'signed'
  | 'denied'
  | 'cancelled';

type BadgeColor = 'grey' | 'brand' | 'success' | 'warn' | 'error';

const STATUS_META: Record<PipelineStatus, { label: string; color: BadgeColor }> = {
  pending:   { label: 'Pending',   color: 'grey'    },
  approved:  { label: 'Approved',  color: 'brand'   },
  signed:    { label: 'Signed',    color: 'success' },
  denied:    { label: 'Denied',    color: 'error'   },
  cancelled: { label: 'Cancelled', color: 'grey'    },
};

const DEFAULT_OPTIONS: PipelineStatus[] = [
  'pending',
  'approved',
  'signed',
  'denied',
  'cancelled',
];

function IconChevron(): React.ReactElement {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}
function IconCheck(): React.ReactElement {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="2.5 6.5 5 9 9.5 3.5" />
    </svg>
  );
}

export interface StatusBadgeProps {
  value: PipelineStatus;
  onChange?: (next: PipelineStatus) => void;
  disabled?: boolean;
  options?: PipelineStatus[];
  size?: 'sm' | 'md';
}

export function StatusBadge({
  value,
  onChange,
  disabled = false,
  options = DEFAULT_OPTIONS,
  size = 'sm',
}: StatusBadgeProps): React.ReactElement {
  const meta = STATUS_META[value];
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // React 18 portal rule: wait for client mount before using document.
  useEffect(() => { setMounted(true); }, []);

  // Compute menu position after open, so getBoundingClientRect is accurate.
  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 6, left: r.left });
  }, [open]);

  // Click-outside, Esc, and scroll dismiss. Scroll closes because the
  // menu is position:fixed and would drift otherwise.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent): void {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent): void {
      if (e.key === 'Escape') setOpen(false);
    }
    function onScroll(): void { setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    window.addEventListener('scroll', onScroll, true); // capture so inner scrolls fire too
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  const interactive = !disabled && typeof onChange === 'function';

  function toggle(e: React.MouseEvent): void {
    if (!interactive) return;
    e.stopPropagation();
    setOpen((o) => !o);
  }
  function pick(next: PipelineStatus): void {
    setOpen(false);
    if (next !== value) onChange?.(next);
  }

  return (
    <span className="ui-status-badge">
      <span
        ref={triggerRef}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={toggle}
        onKeyDown={(e) => {
          if (!interactive) return;
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); }
        }}
        className={interactive ? 'ui-status-badge-trigger' : undefined}
        aria-haspopup={interactive ? 'listbox' : undefined}
        aria-expanded={interactive ? open : undefined}
      >
        <Badge
          color={meta.color}
          size={size}
          dot
          trailingIcon={interactive ? <IconChevron /> : undefined}
        >
          {meta.label}
        </Badge>
      </span>

      {open && interactive && mounted && menuPos && createPortal(
        <ul
          ref={menuRef}
          className="ui-status-menu ui-status-menu-portal ui-scope"
          data-theme={readScopeTheme(triggerRef.current)}
          role="listbox"
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const o = STATUS_META[opt];
            const current = opt === value;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={current}
                className={`ui-status-menu-item ${current ? 'ui-status-menu-item-current' : ''}`}
                onClick={() => pick(opt)}
              >
                <Badge color={o.color} size={size} dot>{o.label}</Badge>
                {current && <span className="ui-status-menu-check" aria-label="actual"><IconCheck /></span>}
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </span>
  );
}
