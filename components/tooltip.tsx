// v2 Tooltip — hover-delayed floating label. Works for simple text labels
// (icon-only buttons: "Refrescar") AND rich content (chart point payloads).
//
//   <Tooltip content="Refrescar">
//     <Button iconOnly aria-label="Refrescar"><IconRefresh /></Button>
//   </Tooltip>
//
//   <Tooltip side="top" content={<ChartPayload date={d} value={v} delta={delta} />}>
//     <circle cx={x} cy={y} r={4} />
//   </Tooltip>
//
// Positioned relative to the wrapper, no portal. On delay (default 400ms)
// before showing; hides immediately on leave.
'use client';

import { useEffect, useRef, useState } from 'react';
import './tooltip.css';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: Side;
  align?: Align;
  /** Hover-intent delay in ms before the tooltip appears. */
  delay?: number;
  /** Max width in px for the tooltip body. Default 240. */
  maxWidth?: number;
  /** Force open/closed — set when you want to drive it externally. */
  open?: boolean;
  className?: string;
  /** Omit the arrow caret. */
  noArrow?: boolean;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 400,
  maxWidth = 240,
  open: controlled,
  className = '',
  noArrow = false,
}: TooltipProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(): void {
    if (controlled !== undefined) return;
    timer.current = setTimeout(() => setInternalOpen(true), delay);
  }
  function hide(): void {
    if (controlled !== undefined) return;
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setInternalOpen(false);
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const open = controlled ?? internalOpen;

  return (
    <span
      className={`ui-tooltip-wrap ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={`ui-tooltip ui-tooltip-${side} ui-tooltip-align-${align}`}
          style={{ maxWidth }}
        >
          {content}
          {!noArrow && <span className="ui-tooltip-arrow" aria-hidden />}
        </span>
      )}
    </span>
  );
}
