'use client';

// AlertsPopup — reusable popup-card for showing a filterable list of alerts.
//
// Composition: Modal (overlay + rounded card chrome + X close) + ChipGroup
// filters (property + category) + a dense alerts table body.
//
// The popup is self-contained: pass it a flat list of AlertItem rows and it
// derives the filter options from them. Caller controls open/close.

import { useMemo, useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from './modal';
import { Select, MultiSelect, type SelectOption } from './select';
import './alerts-popup.css';

export interface AlertItem {
  id: string;
  property: string;   // 'EAST'
  category: string;   // 'NTV', 'Vacant Not Ready', 'Insufficient Notice' …
  unit?: string;      // '47B1'
  resident?: string;  // 'Luciana Philippe'
  alertMsg: string;   // 'Lease ends in 4d — no NTV filed'
  daysAgo?: number;   // age since first-seen
}

export interface AlertsPopupProps {
  open: boolean;
  onClose: () => void;
  alerts: AlertItem[];
  title?: string;
  dotColor?: 'red' | 'amber';
  /** Fallback empty-state hint when the filtered list is empty. */
  emptyMessage?: string;
}

export function AlertsPopup({
  open,
  onClose,
  alerts,
  title = 'Alerts',
  dotColor = 'red',
  emptyMessage = 'No alerts match the current filters.',
}: AlertsPopupProps): React.ReactElement {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  // Reset filters whenever the popup is reopened so stale filter state doesn't
  // bleed between sessions.
  useEffect(() => {
    if (open) {
      setSelectedProperty(null);
      setSelectedCats([]);
    }
  }, [open]);

  const propertyOptions: SelectOption[] = useMemo(() => {
    const set = new Set(alerts.map((a) => a.property));
    return Array.from(set).sort().map((p) => ({ value: p, label: p }));
  }, [alerts]);

  const categoryOptions: SelectOption[] = useMemo(() => {
    const set = new Set(alerts.map((a) => a.category));
    return Array.from(set).sort().map((c) => ({ value: c, label: c }));
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts.filter((a) =>
      (!selectedProperty || a.property === selectedProperty) &&
      (selectedCats.length === 0 || selectedCats.includes(a.category))
    );
  }, [alerts, selectedProperty, selectedCats]);

  const dotCls = dotColor === 'amber' ? 'ui-alerts-dot-amber' : 'ui-alerts-dot-red';
  const chipCls = dotColor === 'amber'
    ? 'ui-alerts-count-chip ui-alerts-count-chip-amber'
    : 'ui-alerts-count-chip';

  const titleEl = (
    <span className="ui-alerts-title">
      <span>{title}</span>
      <span className={chipCls}>{filtered.length}</span>
    </span>
  );

  const headerTone = dotColor === 'amber' ? 'warn' : 'error';

  return (
    <Modal open={open} onClose={onClose} size="xxl">
      <ModalHeader
        title={titleEl}
        icon={<IconAlertTriangle />}
        tone={headerTone}
        onClose={onClose}
      />

      <div className="ui-alerts-filters">
        <div className="ui-alerts-filter-field">
          <Select
            label="Property"
            placeholder="All properties"
            options={propertyOptions}
            value={selectedProperty}
            onChange={setSelectedProperty}
            size="sm"
          />
        </div>
        <div className="ui-alerts-filter-field">
          <MultiSelect
            label="Alert type"
            placeholder="All categories"
            options={categoryOptions}
            value={selectedCats}
            onChange={setSelectedCats}
            size="sm"
          />
        </div>
      </div>

      <ModalBody>
        {filtered.length === 0 ? (
          <div className="ui-alerts-empty">{emptyMessage}</div>
        ) : (
          <table className="ui-alerts-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Resident</th>
                <th>Alert</th>
                <th className="ui-alerts-age-col">Age</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const ageCls = ageBadgeClass(a.daysAgo);
                return (
                  <tr key={a.id}>
                    <td className="ui-alerts-prop">{a.property}</td>
                    <td className="ui-alerts-cat">{a.category}</td>
                    <td className="ui-alerts-unit">{a.unit ?? '—'}</td>
                    <td>{a.resident ?? '—'}</td>
                    <td>
                      <span className="ui-alerts-msg">
                        <span className={`ui-alerts-dot ${dotCls}`} />
                        <span>{a.alertMsg}</span>
                      </span>
                    </td>
                    <td className="ui-alerts-age-col">
                      {typeof a.daysAgo === 'number'
                        ? <span className={`ui-alerts-age-badge ${ageCls}`}>{a.daysAgo}d</span>
                        : <span className="ui-alerts-dim">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ModalBody>
    </Modal>
  );
}

function ageBadgeClass(days?: number): string {
  if (typeof days !== 'number') return '';
  if (days >= 14) return 'ui-alerts-age-high';
  if (days >= 7)  return 'ui-alerts-age-med';
  return 'ui-alerts-age-low';
}

function IconAlertTriangle(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
