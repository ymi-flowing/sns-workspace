// Snapshot loader — fetches data.json from the sns-daily-report repo
// via GH raw URL with Next.js ISR (60s revalidation).
//
// This is the single data contract during the parallel-migration window.
// Shape matches what generate_dashboard.py writes in its `data.json`.

const DATA_URL = 'https://raw.githubusercontent.com/ymi-flowing/sns-daily-report/main/data.json';

export type PropertyAbbr = 'ROP' | 'TV' | 'SJ' | 'MUSO' | 'MOC' | 'EAST' | 'ORT' | '49thStr' | 'AP';

export interface AlertItem {
  unit?: string;
  unitId?: string;
  resident?: string;
  applicant?: string;
  name?: string;
  leaseId?: string;
  hasAlert?: boolean;
  alertMsg?: string;
  firstSeen?: string;
  daysAgo?: number;
}

export interface PropertyData {
  abbr: string;
  name: string;
  total: number;
  occupied: number;
  vacantReady: number;
  vacantNotReady: number;
  vacantLeased: number;
  ntv: number;
  ntvLeased: number;
  eviction: number;
  offMarket: number;
  occupancy: number;              // percentage, 0-100
  futureMI: number;
  futureMO: number;
  futureMovesMonth?: string;
  vacantNotReadyAlerts?: number;
  ntvAlerts?: number;
  vacantLeasedAlerts?: number;
  // Alert-list payloads
  vacantNotReadyList?: AlertItem[];
  ntvList?: AlertItem[];
  vacantLeasedList?: AlertItem[];
  ntvLeasedList?: AlertItem[];
  insufficientNoticeList?: AlertItem[];
  pendingInRealUnitList?: AlertItem[];
  approvedPaidInHoldingList?: AlertItem[];
}

export interface TrafficStats {
  total: number;       // MTD prospect count
  daily_avg: number;
}

export interface ExpiringMonth {
  Current?: number;
  'Pending Renewal'?: number;
  Renewed?: number;
  'NTV/Formers'?: number;
  'Under Eviction'?: number;
}

export interface LeasesData {
  total_applicants: number;
  pending_approval: number;
  approved: number;
  signed_lease: number;
  signed_leases_mtd: number;
  applicants_mtd?: number;
  applicants_mtd_approved?: number;
  applicants_mtd_denied?: number;
  applicants_mtd_cancelled?: number;
  applicants_mtd_active?: number;
  expiring?: {
    month1?: ExpiringMonth;
    month2?: ExpiringMonth;
    month3?: ExpiringMonth;
    month4?: ExpiringMonth;
    month1_label?: string;
    month2_label?: string;
    month3_label?: string;
    month4_label?: string;
    expiringLists?: Record<string, AlertItem[]>;
    insufficientNoticeList?: AlertItem[];
  };
  renovation?: { renovated: number; partial: number; classic: number };
  work_orders?: { open_total: number; new_24h: number };
  future_moves?: { future_mo: number; futureMOList?: AlertItem[]; month_label?: string };
}

export interface FinancialRow { charge?: number; credit?: number; receivable_mtd?: number }
export interface DelinquencyRow { current?: number; eviction?: number; formers?: number }

export interface DashboardSnapshot {
  generatedAt: string;
  monthStr: string;
  propertyGroups: Record<string, PropertyAbbr[]>;
  tableData: Record<PropertyAbbr, PropertyData>;
  trafficData: Record<PropertyAbbr, TrafficStats>;
  leasesData: Record<PropertyAbbr, LeasesData>;
  financialData: {
    income: Record<PropertyAbbr, FinancialRow>;
    delinquency: Record<PropertyAbbr, DelinquencyRow>;
    timestamp?: string;
  };
}

export async function loadSnapshot(): Promise<DashboardSnapshot> {
  const resp = await fetch(DATA_URL, { next: { revalidate: 60 } });
  if (!resp.ok) {
    throw new Error(`Failed to fetch snapshot: ${resp.status} ${resp.statusText}`);
  }
  return (await resp.json()) as DashboardSnapshot;
}
