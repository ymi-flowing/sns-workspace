// Traffic (Month-to-Date) + Traffic (Snapshot) — two sibling cards that
// mirror the split in the current HTML dashboard. Both are per-property × metric
// matrices rendered via the shared SNS UI kit MatrixTable.
'use client';

import { Card, CardHeader } from '../../components';
import { MatrixTable, type ColumnGroup, type MatrixRow, type GroupTone } from '../../components/matrix-table';
import type { DashboardSnapshot, PropertyAbbr, LeasesData, TrafficStats } from '../../lib/data';

const REGION_TONE: Record<string, GroupTone> = {
  Tampa:            'purple',
  Orlando:          'sky',
  Jacksonville:     'teal',
  'Ft. Lauderdale': 'rose',
};

export interface TrafficProps {
  snapshot: DashboardSnapshot;
}

export function Traffic({ snapshot }: TrafficProps): React.ReactElement {
  const columnGroups: ColumnGroup[] = Object.entries(snapshot.propertyGroups).map(
    ([region, abbrs]) => ({
      label: region,
      abbrs: abbrs as string[],
      tone: REGION_TONE[region] ?? 'slate',
    })
  );
  const allAbbrs = columnGroups.flatMap((g) => g.abbrs);
  const ld = snapshot.leasesData;
  const tr = snapshot.trafficData;

  const sumT = (f: (t: TrafficStats) => number): number =>
    allAbbrs.reduce((s, a) => s + (f(tr[a as PropertyAbbr]) || 0), 0);
  const sumL = (f: (l: LeasesData) => number): number =>
    allAbbrs.reduce((s, a) => s + (f(ld[a as PropertyAbbr]) || 0), 0);

  // ---------- Traffic (Month-to-Date) ----------
  const totalProspects   = sumT((t) => t?.total ?? 0);
  const totalSignedMtd   = sumL((l) => l?.signed_leases_mtd ?? 0);
  const totalApplicantsMtd         = sumL((l) => l?.applicants_mtd ?? 0);
  const totalApplicantsApproved    = sumL((l) => l?.applicants_mtd_approved ?? 0);
  const totalApplicantsDenied      = sumL((l) => l?.applicants_mtd_denied ?? 0);
  const totalApplicantsCancelled   = sumL((l) => l?.applicants_mtd_cancelled ?? 0);
  const totalApplicantsActive      = sumL((l) => l?.applicants_mtd_active ?? 0);

  const mtdRows: MatrixRow[] = [
    { key: 'prospects', label: 'Total Prospects', color: 'ui-matrix-text-brand',
      getValue: (a) => tr[a as PropertyAbbr]?.total ?? 0,
      getTotal: () => totalProspects },

    { key: 'dailyAvg', label: 'Daily AVG', color: 'ui-matrix-text-muted',
      getValue: (a) => (tr[a as PropertyAbbr]?.daily_avg ?? 0).toFixed(1),
      getTotal: () => (sumT((t) => t?.daily_avg ?? 0)).toFixed(1) },

    { key: 'signedMtd', label: 'Signed Leases MTD', color: 'ui-matrix-text-success',
      getValue: (a) => ld[a as PropertyAbbr]?.signed_leases_mtd ?? 0,
      getTotal: () => totalSignedMtd },

    { key: 'convRate', label: 'Conversion Rate %', color: 'ui-matrix-text-brand', isPercent: true,
      getValue: (a) => {
        const p = tr[a as PropertyAbbr]?.total ?? 0;
        const s = ld[a as PropertyAbbr]?.signed_leases_mtd ?? 0;
        return p === 0 ? '0.0' : ((s / p) * 100).toFixed(1);
      },
      getTotal: () => totalProspects === 0 ? '0.0' : ((totalSignedMtd / totalProspects) * 100).toFixed(1) },

    { key: 'div', label: '', isDivider: true },

    { key: 'applicantsMtd', label: 'Applicants MTD', color: 'ui-matrix-text-primary',
      getValue: (a) => ld[a as PropertyAbbr]?.applicants_mtd ?? 0,
      getTotal: () => totalApplicantsMtd },

    { key: 'approved', label: 'Approved', color: 'ui-matrix-text-success',
      getValue: (a) => ld[a as PropertyAbbr]?.applicants_mtd_approved ?? 0,
      getTotal: () => totalApplicantsApproved },

    { key: 'denied', label: 'Denied', color: 'ui-matrix-text-error',
      getValue: (a) => ld[a as PropertyAbbr]?.applicants_mtd_denied ?? 0,
      getTotal: () => totalApplicantsDenied },

    { key: 'cancelled', label: 'Cancelled', color: 'ui-matrix-text-muted',
      getValue: (a) => ld[a as PropertyAbbr]?.applicants_mtd_cancelled ?? 0,
      getTotal: () => totalApplicantsCancelled },

    { key: 'active', label: 'Still Active', color: 'ui-matrix-text-warn',
      getValue: (a) => ld[a as PropertyAbbr]?.applicants_mtd_active ?? 0,
      getTotal: () => totalApplicantsActive },
  ];

  // ---------- Traffic (Snapshot) ----------
  const totalApplicants  = sumL((l) => l?.total_applicants ?? 0);
  const totalPending     = sumL((l) => l?.pending_approval ?? 0);
  const totalApproved    = sumL((l) => l?.approved ?? 0);
  const totalSignedLease = sumL((l) => l?.signed_lease ?? 0);

  const snapshotRows: MatrixRow[] = [
    { key: 'totalApplicants', label: 'Total Applicants', color: 'ui-matrix-text-primary',
      getValue: (a) => ld[a as PropertyAbbr]?.total_applicants ?? 0,
      getTotal: () => totalApplicants },

    { key: 'pending', label: 'Pending Approval', color: 'ui-matrix-text-warn',
      getValue: (a) => ld[a as PropertyAbbr]?.pending_approval ?? 0,
      getTotal: () => totalPending },

    { key: 'approved', label: 'Approved', color: 'ui-matrix-text-brand',
      getValue: (a) => ld[a as PropertyAbbr]?.approved ?? 0,
      getTotal: () => totalApproved },

    { key: 'signedLease', label: 'Signed Lease', color: 'ui-matrix-text-success',
      getValue: (a) => ld[a as PropertyAbbr]?.signed_lease ?? 0,
      getTotal: () => totalSignedLease },
  ];

  return (
    <>
      <Card padding="sm">
        <CardHeader
          title="Traffic Month-to-Date"
          subtitle={`${snapshot.monthStr} · prospects, signed leases, and applicant flow`}
        />
        <MatrixTable columnGroups={columnGroups} rows={mtdRows} />
      </Card>

      <Card padding="sm">
        <CardHeader
          title="Traffic Snapshot"
          subtitle="Currently active applicants by status"
        />
        <MatrixTable columnGroups={columnGroups} rows={snapshotRows} />
      </Card>
    </>
  );
}
