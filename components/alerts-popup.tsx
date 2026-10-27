// AlertsPopup — reusable popup-card for showing a filterable list of alerts.
//
// Composition: Modal (overlay + rounded card chrome + X close) + ChipGroup
// filters (property + category) + a dense alerts table body.
//
// The popup is self-contained: pass it a flat list of AlertItem rows and it
// derives the filter options from them. Caller controls open/close.

import { useMemo, useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from './modal';
import { ChipGroup, type ChipOption } from './chip-group';
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
  const [selectedProps, setSelectedProps] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  // Reset filters whenever the popup is reopened so stale filter state doesn't
  // bleed between sessions.
  useEffect(() => {
    if (open) {
      setSelectedProps([]);
      setSelectedCats([]);
    }
  }, [open]);

  const propertyOptions: ChipOption[] = useMemo(() => {
    const set = new Set(alerts.map((a) => a.property));
    return Array.from(set).sort().map((p) => ({ value: p, label: p }));
  }, [alerts]);

  const categoryOptions: ChipOption[] = useMemo(() => {
    const set = new Set(alerts.map((a) => a.category));
    return Array.from(set).sort().map((c) => ({ value: c, label: c }));
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts.filter((a) =>
      (selectedProps.length === 0 || selectedProps.includes(a.property)) &&
      (selectedCats.length === 0 || selectedCats.includes(a.category))
    );
  }, [alerts, selectedProps, selectedCats]);

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

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title={titleEl} onClose={onClose} />

      <div className="ui-alerts-filters">
        {propertyOptions.length > 0 && (
          <div className="ui-alerts-filter-group">
            <span className="ui-alerts-filter-label">Properties</span>
            <ChipGroup
              options={propertyOptions}
              value={selectedProps}
              onChange={setSelectedProps}
              size="sm"
            />
          </div>
        )}
        {categoryOptions.length > 0 && (
          <div className="ui-alerts-filter-group">
            <span className="ui-alerts-filter-label">Categories</span>
            <ChipGroup
              options={categoryOptions}
              value={selectedCats}
              onChange={setSelectedCats}
              size="sm"
            />
          </div>
        )}
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
