// Expiring Leases — 4-month renewal snapshot per property.
//
// Each row is a month (current + next 3). Each cell shows the renewal % for
// that month at that property (Renewed / all-but-pending). Alert bg when the
// property has any insufficient-notice lease in that month bucket.
'use client';

import { Card, CardHeader } from '../../components';
import { MatrixTable, type ColumnGroup, type MatrixRow, type GroupTone } from '../../components/matrix-table';
import type { DashboardSnapshot, PropertyAbbr, ExpiringMonth, AlertItem } from '../../lib/data';

const REGION_TONE: Record<string, GroupTone> = {
  Tampa:            'purple',
  Orlando:          'sky',
  Jacksonville:     'teal',
  'Ft. Lauderdale': 'rose',
};

const MONTH_KEYS = ['month1', 'month2', 'month3', 'month4'] as const;
type MonthKey = (typeof MONTH_KEYS)[number];

function renewalPct(bucket: ExpiringMonth | undefined): { pct: number; total: number; renewed: number } {
  const renewed = bucket?.Renewed ?? 0;
  const total =
    (bucket?.Current ?? 0) +
    (bucket?.Renewed ?? 0) +
    (bucket?.['NTV/Formers'] ?? 0) +
    (bucket?.['Under Eviction'] ?? 0);
  const pct = total > 0 ? (renewed / total) * 100 : 0;
  return { pct, total, renewed };
}

/** Renewal thresholds matching the current dashboard's palette. */
function renewalColorClass(pct: number, total: number): string | undefined {
  if (total === 0) return 'ui-matrix-text-muted';
  if (pct >= 70) return 'ui-matrix-text-success';
  if (pct >= 50) return 'ui-matrix-text-warn';
  return 'ui-matrix-text-error';
}

function monthHasAlertFor(snapshot: DashboardSnapshot, abbr: PropertyAbbr, monthKey: MonthKey): boolean {
  const list = snapshot.leasesData[abbr]?.expiring?.expiringLists?.[monthKey] as AlertItem[] | undefined;
  return !!list?.some((row) => row.hasAlert);
}

function monthLabel(snapshot: DashboardSnapshot, monthKey: MonthKey): string {
  for (const abbr of Object.keys(snapshot.leasesData)) {
    const label = snapshot.leasesData[abbr as PropertyAbbr]?.expiring?.[`${monthKey}_label` as `${MonthKey}_label`];
    if (label) return label;
  }
  return monthKey;
}

export interface ExpiringLeasesProps {
  snapshot: DashboardSnapshot;
}

export function ExpiringLeases({ snapshot }: ExpiringLeasesProps): React.ReactElement {
  const columnGroups: ColumnGroup[] = Object.entries(snapshot.propertyGroups).map(
    ([region, abbrs]) => ({
      label: region,
      abbrs: abbrs as string[],
      tone: REGION_TONE[region] ?? 'slate',
    })
  );
  const allAbbrs = columnGroups.flatMap((g) => g.abbrs);

  const rows: MatrixRow[] = MONTH_KEYS.map((monthKey) => {
    const label = monthLabel(snapshot, monthKey);
    return {
      key: monthKey,
      label,
      isPercent: true,
      getValue: (a) => {
        const bucket = snapshot.leasesData[a as PropertyAbbr]?.expiring?.[monthKey];
        const { pct, total } = renewalPct(bucket);
        return total === 0 ? '—' : pct.toFixed(0);
      },
      getCellColor: (a) => {
        const bucket = snapshot.leasesData[a as PropertyAbbr]?.expiring?.[monthKey];
        const { pct, total } = renewalPct(bucket);
        return renewalColorClass(pct, total);
      },
      getAlert: (a) =>
        monthHasAlertFor(snapshot, a as PropertyAbbr, monthKey)
          ? 'Property has lease(s) with insufficient-notice alert this month'
          : null,
      getTotal: () => {
        let renewed = 0;
        let total = 0;
        for (const abbr of allAbbrs) {
          const bucket = snapshot.leasesData[abbr as PropertyAbbr]?.expiring?.[monthKey];
          const r = renewalPct(bucket);
          renewed += r.renewed;
          total += r.total;
        }
        return total === 0 ? '—' : ((renewed / total) * 100).toFixed(0);
      },
      getTotalColor: () => {
        let renewed = 0;
        let total = 0;
        for (const abbr of allAbbrs) {
          const bucket = snapshot.leasesData[abbr as PropertyAbbr]?.expiring?.[monthKey];
          const r = renewalPct(bucket);
          renewed += r.renewed;
          total += r.total;
        }
        return renewalColorClass(total > 0 ? (renewed / total) * 100 : 0, total);
      },
    };
  });

  const monthTotals = MONTH_KEYS.map((monthKey) => {
    let count = 0;
    for (const abbr of allAbbrs) {
      const bucket = snapshot.leasesData[abbr as PropertyAbbr]?.expiring?.[monthKey];
      count += renewalPct(bucket).total;
    }
    return { monthKey, label: monthLabel(snapshot, monthKey), count };
  });
  const totalExpiring = monthTotals.reduce((s, m) => s + m.count, 0);
  const subtitle = `Next 4 months · ${totalExpiring} leases expiring · ${monthTotals.map((m) => `${m.label} ${m.count}`).join(' · ')}`;

  return (
    <Card padding="sm">
      <CardHeader
        title="Expiring Leases"
        subtitle={subtitle}
      />
      <MatrixTable
        columnGroups={columnGroups}
        rows={rows}
        metricLabel="Month"
      />
    </Card>
  );
}
