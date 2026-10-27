// Portfolio Matrix — per-property × per-metric grid for the home page.
//
// Mirrors the main status table in dashboard_live.html, built on top of
// the SNS UI kit's <MatrixTable>. Groups properties by region (Tampa /
// Orlando / Jacksonville / Ft. Lauderdale) and renders unit-status rows
// with alert backgrounds + clickable cells.
'use client';

import { useState } from 'react';
import { Card, CardHeader, Button } from '../../components';
import { MatrixTable, type ColumnGroup, type MatrixRow, type GroupTone } from '../../components/matrix-table';
import { AlertsPopup, type AlertItem as PopupAlertItem } from '../../components/alerts-popup';
import type { DashboardSnapshot, PropertyAbbr, PropertyData, AlertItem } from '../../lib/data';

function IconAlert(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const REGION_TONE: Record<string, GroupTone> = {
  Tampa:            'purple',
  Orlando:          'sky',
  Jacksonville:     'teal',
  'Ft. Lauderdale': 'rose',
};

export interface PortfolioMatrixProps {
  snapshot: DashboardSnapshot;
}

export function PortfolioMatrix({ snapshot }: PortfolioMatrixProps): React.ReactElement {
  const [alertsOpen, setAlertsOpen] = useState(false);

  const columnGroups: ColumnGroup[] = Object.entries(snapshot.propertyGroups).map(
    ([region, abbrs]) => ({
      label: region,
      abbrs: abbrs as string[],
      tone: REGION_TONE[region] ?? 'slate',
    })
  );
  const allAbbrs = columnGroups.flatMap((g) => g.abbrs);
  const td = snapshot.tableData;

  const sum = (f: (p: PropertyData) => number): number =>
    allAbbrs.reduce((s, a) => s + (f(td[a as PropertyAbbr]) || 0), 0);

  // Alert-row aggregator: flatten alerted entries across every list on every property
  // into the AlertItem[] shape AlertsPopup expects.
  const popupAlerts: PopupAlertItem[] = [];
  const pushList = (list: AlertItem[] | undefined, abbr: string, category: string, idPrefix: string) => {
    (list || []).forEach((item, idx) => {
      if (!item.hasAlert) return;
      popupAlerts.push({
        id: `${idPrefix}-${abbr}-${idx}`,
        property: abbr,
        category,
        unit: item.unit,
        resident: item.resident || item.applicant || item.name,
        alertMsg: item.alertMsg || 'Needs attention',
        daysAgo: item.daysAgo,
      });
    });
  };
  allAbbrs.forEach((abbr) => {
    const p = td[abbr as PropertyAbbr];
    if (!p) return;
    pushList(p.vacantNotReadyList, abbr, 'Vacant Not Ready', 'vnr');
    pushList(p.ntvList,            abbr, 'NTV',              'ntv');
    pushList(p.vacantLeasedList,   abbr, 'Vacant Leased',    'vl');
  });

  const alertsCount = popupAlerts.length;

  const rows: MatrixRow[] = [
    { key: 'total', label: 'Total units', color: 'ui-matrix-text-primary',
      getValue: (a) => td[a as PropertyAbbr]?.total ?? 0,
      getTotal: () => sum((p) => p.total) },

    { key: 'occupied', label: 'Occupied', color: 'ui-matrix-text-success',
      getValue: (a) => td[a as PropertyAbbr]?.occupied ?? 0,
      getTotal: () => sum((p) => p.occupied) },

    { key: 'vacantReady', label: 'Vacant Ready', color: 'ui-matrix-text-brand',
      getValue: (a) => td[a as PropertyAbbr]?.vacantReady ?? 0,
      getTotal: () => sum((p) => p.vacantReady) },

    { key: 'vacantNR', label: 'Vacant Not Ready', color: 'ui-matrix-text-warn',
      getValue: (a) => td[a as PropertyAbbr]?.vacantNotReady ?? 0,
      getTotal: () => sum((p) => p.vacantNotReady),
      getAlert: (a) => (td[a as PropertyAbbr]?.vacantNotReadyAlerts ?? 0) > 0 ? 'Has aging vacant units' : null },

    { key: 'vacantLeased', label: 'Vacant Leased', color: 'ui-matrix-text-brand',
      getValue: (a) => td[a as PropertyAbbr]?.vacantLeased ?? 0,
      getTotal: () => sum((p) => p.vacantLeased),
      getAlert: (a) => (td[a as PropertyAbbr]?.vacantLeasedAlerts ?? 0) > 0 ? 'Has aging vacant-leased units' : null },

    { key: 'ntv', label: 'NTV', color: 'ui-matrix-text-warn',
      getValue: (a) => td[a as PropertyAbbr]?.ntv ?? 0,
      getTotal: () => sum((p) => p.ntv),
      getAlert: (a) => (td[a as PropertyAbbr]?.ntvAlerts ?? 0) > 0 ? 'Has aging NTVs without replacement' : null },

    { key: 'ntvLeased', label: 'NTV Leased', color: 'ui-matrix-text-warn',
      getValue: (a) => td[a as PropertyAbbr]?.ntvLeased ?? 0,
      getTotal: () => sum((p) => p.ntvLeased) },

    { key: 'eviction', label: 'Under Eviction', color: 'ui-matrix-text-error',
      getValue: (a) => td[a as PropertyAbbr]?.eviction ?? 0,
      getTotal: () => sum((p) => p.eviction) },

    { key: 'offMarket', label: 'Off Market', color: 'ui-matrix-text-muted',
      getValue: (a) => td[a as PropertyAbbr]?.offMarket ?? 0,
      getTotal: () => sum((p) => p.offMarket) },

    { key: 'div1', label: '', isDivider: true },

    { key: 'occupancy', label: 'Occupancy', color: 'ui-matrix-text-success', isPercent: true,
      getValue: (a) => (td[a as PropertyAbbr]?.occupancy ?? 0).toFixed(1),
      getTotal: () => {
        const totalUnits = sum((p) => p.total);
        return totalUnits > 0 ? (sum((p) => p.occupied) / totalUnits * 100).toFixed(1) : '0.0';
      } },

    { key: 'div2', label: '', isDivider: true },

    { key: 'futureMI', label: `Future MI`, color: 'ui-matrix-text-brand',
      getValue: (a) => td[a as PropertyAbbr]?.futureMI ?? 0,
      getTotal: () => sum((p) => p.futureMI) },

    { key: 'futureMO', label: `Future MO`, color: 'ui-matrix-text-warn',
      getValue: (a) => td[a as PropertyAbbr]?.futureMO ?? 0,
      getTotal: () => sum((p) => p.futureMO) },
  ];

  return (
    <>
      <Card padding="sm">
        <CardHeader
          title="Portfolio status"
          subtitle={`${snapshot.monthStr} · ${allAbbrs.length} properties · ${sum((p) => p.total)} units`}
          actions={
            alertsCount > 0 ? (
              <Button hierarchy="secondary-color" size="sm" leadingIcon={<IconAlert />} onClick={() => setAlertsOpen(true)}>
                View alerts · {alertsCount}
              </Button>
            ) : undefined
          }
        />
        <MatrixTable columnGroups={columnGroups} rows={rows} />
      </Card>

      <AlertsPopup
        open={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        title="Portfolio alerts"
        dotColor="red"
        alerts={popupAlerts}
      />
    </>
  );
}
