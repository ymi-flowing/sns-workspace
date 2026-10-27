// SNS UI kit — brand swatches + typography ramp + component showcase.
// This is the "lab" page for the kit. Will be replaced by the real SNS
// Next.js dashboard once per-property + per-region routes are wired.
// Client component so interactive demos (onRemove on Badge, onClick on
// Button) just work.
'use client';

import { Button } from '../components/button';
import { Input, Textarea } from '../components/input';
import { Badge } from '../components/badge';
import { StatusBadge, type PipelineStatus } from '../components/status-badge';
import { Card, CardHeader, CardFooter, KpiCard } from '../components/card';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/modal';
import { Dropdown, DropdownItem, DropdownDivider, Select, MultiSelect, type SelectOption } from '../components/select';
import { SegmentedControl, ToggleButtonGroup, type SegmentOption } from '../components/segmented';
import { Checkbox, RadioGroup } from '../components/checkbox';
import { Toggle } from '../components/toggle';
import { Table, type Column, type Sort } from '../components/table';
import { MatrixTable, type ColumnGroup, type MatrixRow } from '../components/matrix-table';
import { AlertsPopup, type AlertItem } from '../components/alerts-popup';
import { DatePicker, DateRangePicker } from '../components/date-picker';
import { Tooltip } from '../components/tooltip';
import { Alert } from '../components/alert';
import { useToast } from '../components/toast';
import { ChipGroup, type ChipOption } from '../components/chip-group';
import { LineChart, DonutChart } from '../components/charts';
import { useTheme } from '../components/theme-provider';
import { useState } from 'react';

const BRAND_SWATCHES = [
  { label: '--ui-brand-500', bg: 'var(--ui-brand-500)' },
  { label: '--ui-brand-600', bg: 'var(--ui-brand-600)' },
  { label: '--ui-brand-700', bg: 'var(--ui-brand-700)' },
  { label: '--ui-grey-800',  bg: 'var(--ui-grey-800)'  },
  { label: '--ui-grey-850',  bg: 'var(--ui-grey-850)'  },
  { label: '--ui-grey-900',  bg: 'var(--ui-grey-900)'  },
  { label: '--ui-grey-950',  bg: 'var(--ui-grey-950)'  },
  { label: '--ui-border-primary',   bg: 'var(--ui-border-primary)'   },
  { label: '--ui-border-secondary', bg: 'var(--ui-border-secondary)' },
  { label: '--ui-success-500', bg: 'var(--ui-success-500)' },
  { label: '--ui-warn-500',    bg: 'var(--ui-warn-500)'    },
  { label: '--ui-error-500',   bg: 'var(--ui-error-500)'   },
];

function IconPlus(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconArrow(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconSearch(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconMail(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function IconPencil(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
function IconExpand(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
function IconRefresh(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
function IconSun(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function IconLogout(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function IconAlert(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconSettings(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

const HIERARCHIES = [
  { key: 'primary',           label: 'Primary' },
  { key: 'secondary',         label: 'Secondary' },
  { key: 'secondary-color',   label: 'Secondary color' },
  { key: 'tertiary',          label: 'Tertiary' },
  { key: 'tertiary-color',    label: 'Tertiary color' },
  { key: 'destructive',       label: 'Destructive' },
] as const;

const SIZES = ['sm', 'md', 'lg', 'xl'] as const;

export default function V2Dashboard(): React.ReactElement {
  const { toast } = useToast();
  const { theme, toggle: toggleTheme } = useTheme();

  // Local state for the StatusBadge demo so clicking actually mutates visibly.
  const [demoStatus, setDemoStatus] = useState<PipelineStatus>('approved');
  const [openModal, setOpenModal] = useState<null | 'sm' | 'md' | 'lg' | 'confirm' | 'form'>(null);
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [multiValue, setMultiValue] = useState<string[]>(['EAST', 'MP']);
  const [segValue, setSegValue] = useState<string>('all');
  const [tbgSingle, setTbgSingle] = useState<string>('day');
  const [tbgMulti, setTbgMulti] = useState<string[]>(['0', '2', '4']);
  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(false);
  const [radioValue, setRadioValue] = useState<string>('andreani');
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [matrixAlertsOpen, setMatrixAlertsOpen] = useState(false);
  const [tableAlertsOpen, setTableAlertsOpen] = useState(false);

  // Table demo state — SNS applicants with their current status
  type DemoApplicant = { id: string; unit: string; property: string; applicant: string; appDate: string; rent: number; status: PipelineStatus };
  const [tableRows, setTableRows] = useState<DemoApplicant[]>([
    { id: 'a1', unit: '47B1',  property: 'EAST',    applicant: 'Luciana Philippe',   appDate: '2026-10-18', rent: 1850, status: 'pending'   },
    { id: 'a2', unit: '5540C', property: 'MP',      applicant: 'Dieuluc Jean-Louis', appDate: '2026-10-21', rent: 1725, status: 'approved'  },
    { id: 'a3', unit: '201A',  property: 'ROP',     applicant: 'Marcus Harris',      appDate: '2026-10-05', rent: 1980, status: 'signed'    },
    { id: 'a4', unit: '112',   property: 'TV',      applicant: 'Keisha Johnson',     appDate: '2026-10-11', rent: 1620, status: 'denied'    },
    { id: 'a5', unit: '803',   property: '49thStr', applicant: 'Jamal Carter',       appDate: '2026-10-14', rent: 2140, status: 'cancelled' },
    { id: 'a6', unit: '304B',  property: 'SJ',      applicant: 'Priya Patel',        appDate: '2026-10-22', rent: 1775, status: 'approved'  },
    { id: 'a7', unit: '12',    property: 'MOC',     applicant: 'David Thompson',     appDate: '2026-10-24', rent: 1540, status: 'pending'   },
  ]);
  const [tableSelected, setTableSelected] = useState<Set<string>>(new Set());
  const [tableSort, setTableSort] = useState<Sort>({ col: 'appDate', dir: 'desc' });

  const sortedRows = [...tableRows].sort((a, b) => {
    const dir = tableSort.dir === 'asc' ? 1 : -1;
    const key = tableSort.col as keyof DemoApplicant;
    const av = a[key], bv = b[key];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  function setStatus(id: string, next: PipelineStatus): void {
    setTableRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  }

  const fmtUsd = (n: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const tableColumns: Column<DemoApplicant>[] = [
    { key: 'unit',      header: 'Unit',      cell: (a) => <strong>{a.unit}</strong>, width: 80, sortable: true },
    { key: 'property',  header: 'Property',  cell: (a) => a.property, width: 110, sortable: true },
    { key: 'applicant', header: 'Applicant', cell: (a) => a.applicant, sortable: true },
    { key: 'appDate',   header: 'App Date',  cell: (a) => a.appDate, align: 'center', sortable: true, width: 120 },
    { key: 'rent',      header: 'Rent',      cell: (a) => <strong>{fmtUsd(a.rent)}</strong>, align: 'center', sortable: true, width: 110 },
    { key: 'status',    header: 'Status',    cell: (a) => <StatusBadge value={a.status} onChange={(s) => setStatus(a.id, s)} />, width: 200 },
  ];

  const summarySelected = sortedRows.filter((r) => tableSelected.has(r.id));
  const sumRent = summarySelected.reduce((a, r) => a + r.rent, 0);

  // Search + select-all + date demos
  const [searchableValue, setSearchableValue] = useState<string | null>(null);
  const [multiAllValue, setMultiAllValue] = useState<string[]>([]);
  // Big list of unit numbers (property + unit) — mimics a long searchable unit picker
  const BIG_OPTIONS: SelectOption[] = (() => {
    const props = ['ROP', 'TV', 'SJ', 'MUSO', 'MOC', 'EAST', 'ORT', '49thStr', 'AP'];
    const out: SelectOption[] = [];
    props.forEach((p) => {
      for (let i = 1; i <= 3; i++) {
        const unit = `${100 + i * 7}${String.fromCharCode(64 + i)}`;
        out.push({ value: `${p}-${unit}`, label: `${p} · Unit ${unit}` });
      }
    });
    return out;
  })();
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [rangeValue, setRangeValue] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [chipValue, setChipValue] = useState<string[]>(['pet-friendly', 'gym']);
  const CHIP_OPTIONS: ChipOption[] = [
    { value: 'parking',      label: 'Parking' },
    { value: 'gym',          label: 'Gym' },
    { value: 'pool',         label: 'Pool' },
    { value: 'pet-friendly', label: 'Pet Friendly' },
    { value: 'balcony',      label: 'Balcony' },
    { value: 'laundry',      label: 'In-unit Laundry' },
  ];
  const [chipSingle, setChipSingle] = useState<string[]>(['1br']);
  const UNIT_TYPE_OPTIONS: ChipOption[] = [
    { value: 'studio', label: 'Studio' },
    { value: '1br',    label: '1BR' },
    { value: '2br',    label: '2BR' },
    { value: '3br',    label: '3BR' },
    { value: '4br',    label: '4BR+' },
  ];

  const STATUS_OPTIONS: SelectOption[] = [
    { value: 'current',         label: 'Current' },
    { value: 'pending_renewal', label: 'Pending Renewal' },
    { value: 'renewed',         label: 'Renewed' },
    { value: 'ntv',             label: 'NTV' },
    { value: 'under_eviction',  label: 'Under Eviction' },
    { value: 'former',          label: 'Former', disabled: true },
  ];
  const PROPERTY_OPTIONS: SelectOption[] = [
    { value: 'ROP',     label: 'ROP',     hint: 'Royal Oaks Place' },
    { value: 'TV',      label: 'TV',      hint: 'The Veranda' },
    { value: 'SJ',      label: 'SJ',      hint: 'San Juanita' },
    { value: 'MUSO',    label: 'MUSO',    hint: 'The Muse at Olde Towne' },
    { value: 'MOC',     label: 'MOC',     hint: 'Magnolia on Chapman' },
    { value: 'EAST',    label: 'EAST',    hint: 'Eastside Villas' },
    { value: 'ORT',     label: 'ORT',     hint: 'Ortega Pointe' },
    { value: '49thStr', label: '49thStr', hint: '49th Street Apartments' },
    { value: 'AP',      label: 'AP',      hint: 'Alta Palms' },
  ];
  const SEG_OPTIONS: SegmentOption[] = [
    { value: 'all',       label: 'All' },
    { value: 'occupied',  label: 'Occupied' },
    { value: 'vacant',    label: 'Vacant' },
  ];
  const PERIOD_OPTIONS: SegmentOption[] = [
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month' },
  ];
  const DAYS: SegmentOption[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => ({ value: String(i), label: d }));
  const [rowStatuses, setRowStatuses] = useState<PipelineStatus[]>([
    'pending',
    'approved',
    'signed',
    'denied',
    'cancelled',
  ]);
  function setRow(i: number, s: PipelineStatus): void {
    setRowStatuses((prev) => prev.map((v, idx) => (idx === i ? s : v)));
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 48, width: 48, background: '#ffffff', borderRadius: 'var(--ui-radius-md)', padding: 4 }}>
              <img src="/sns-logo.png" alt="SNS" style={{ height: '100%', width: 'auto', display: 'block' }} />
            </div>
            <h1 className="ui-display-sm">SNS UI Kit</h1>
          </div>
          <p className="ui-text-md ui-text-secondary" style={{ marginTop: 'var(--ui-sp-8)' }}>
            Steel blue primary · slate greys · dark-first. Click the button to flip theme.
          </p>
        </div>
        <Button hierarchy="secondary" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
      </div>

      {/* ---------- Palette ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Brand palette</h2>
        <div className="ui-swatch-grid">
          {BRAND_SWATCHES.map((s) => (
            <div key={s.label} className="ui-swatch">
              <div className="ui-swatch-chip" style={{ background: s.bg }} />
              <span className="ui-swatch-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Typography ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Typography scale</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-8)', marginTop: 'var(--ui-sp-12)' }}>
          <div className="ui-display-sm">Display sm — 30/38 semibold</div>
          <div className="ui-display-xs">Display xs — 24/32 semibold</div>
          <div className="ui-text-xl ui-fw-medium">Text xl — 20/30 medium</div>
          <div className="ui-text-lg ui-fw-medium">Text lg — 18/28 medium</div>
          <div className="ui-text-md">Text md — 16/24 regular (body default)</div>
          <div className="ui-text-sm">Text sm — 14/20 regular</div>
          <div className="ui-text-xs ui-text-tertiary">Text xs — 12/18 regular tertiary</div>
        </div>
      </section>

      {/* ---------- Buttons: hierarchies × sizes ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Buttons — hierarchies × sizes</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          6 hierarchies × 4 sizes. Hover for state transitions. Primary = SNS steel blue; destructive = error red.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-16)', marginTop: 'var(--ui-sp-16)' }}>
          {HIERARCHIES.map((h) => (
            <div key={h.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
              <span className="ui-text-xs ui-text-tertiary" style={{ width: 140, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {h.label}
              </span>
              {SIZES.map((s) => (
                <Button key={s} hierarchy={h.key} size={s}>Button {s}</Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Buttons: with icons ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Buttons — icon slots</h2>
        <div style={{ display: 'flex', gap: 'var(--ui-sp-12)', marginTop: 'var(--ui-sp-16)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button hierarchy="primary" leadingIcon={<IconPlus />}>New applicant</Button>
          <Button hierarchy="secondary" trailingIcon={<IconArrow />}>Next</Button>
          <Button hierarchy="secondary-color" leadingIcon={<IconPlus />}>Add resident</Button>
          <Button hierarchy="tertiary">Cancel</Button>
          <Button hierarchy="destructive">File eviction</Button>
          <Button hierarchy="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* ---------- Buttons: icon-only ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Buttons — icon only</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          No frame — just the hierarchy-colored glyph. Hover gets a soft tint for feedback.
          Use for mobile toolbars, inline actions, action menus, anywhere a frame would be visual noise.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-10)', marginTop: 'var(--ui-sp-16)' }}>
          <Tooltip content="Primary"><Button hierarchy="primary"         size="md" iconOnly aria-label="Primary"><IconPlus /></Button></Tooltip>
          <Tooltip content="Secondary"><Button hierarchy="secondary"       size="md" iconOnly aria-label="Secondary"><IconRefresh /></Button></Tooltip>
          <Tooltip content="Secondary color"><Button hierarchy="secondary-color" size="md" iconOnly aria-label="Secondary color"><IconPlus /></Button></Tooltip>
          <Tooltip content="Tertiary"><Button hierarchy="tertiary"        size="md" iconOnly aria-label="Tertiary"><IconSettings /></Button></Tooltip>
          <Tooltip content="Tertiary color"><Button hierarchy="tertiary-color"  size="md" iconOnly aria-label="Tertiary color"><IconSun /></Button></Tooltip>
          <Tooltip content="Destructive"><Button hierarchy="destructive"     size="md" iconOnly aria-label="Destructive"><IconLogout /></Button></Tooltip>
        </div>

        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-24)' }}>
          Mock mobile action row (common pattern):
        </p>
        <div
          style={{
            marginTop: 'var(--ui-sp-8)',
            display: 'flex',
            gap: 'var(--ui-sp-8)',
            padding: 'var(--ui-sp-12)',
            background: 'var(--ui-bg-secondary)',
            border: '1px solid var(--ui-border-primary)',
            borderRadius: 'var(--ui-radius-md)',
            maxWidth: 420,
          }}
        >
          <Tooltip content="Refresh"><Button hierarchy="tertiary"      size="md" iconOnly aria-label="Refresh"><IconRefresh /></Button></Tooltip>
          <Tooltip content="Theme"><Button hierarchy="tertiary"      size="md" iconOnly aria-label="Theme"><IconSun /></Button></Tooltip>
          <Tooltip content="Settings"><Button hierarchy="tertiary"      size="md" iconOnly aria-label="Settings"><IconSettings /></Button></Tooltip>
          <span style={{ flex: 1 }} />
          <Tooltip content="New applicant"><Button hierarchy="primary"      size="md" iconOnly aria-label="New applicant"><IconPlus /></Button></Tooltip>
          <Tooltip content="Sign out"><Button hierarchy="destructive"  size="md" iconOnly aria-label="Sign out"><IconLogout /></Button></Tooltip>
        </div>
      </section>

      {/* ---------- Inputs ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Inputs</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Sizes sm/md · leading/trailing icon · prefix/suffix text · hint · error · disabled.
        </p>
        <div
          style={{
            marginTop: 'var(--ui-sp-16)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--ui-sp-24)',
          }}
        >
          <Input label="Basic" placeholder="Type something" hint="Optional help text." />
          <Input label="Search" placeholder="Search units, residents…" leadingIcon={<IconSearch />} />
          <Input label="Email" type="email" placeholder="resident@example.com" leadingIcon={<IconMail />} />
          <Input label="Property URL" placeholder="sns" prefix="https://" suffix=".myresman.com" />
          <Input label="Rent" placeholder="0" prefix="$" suffix="/mo" size="sm" />
          <Input
            label="With error"
            placeholder="luciana@"
            defaultValue="luciana@"
            errorMessage="Invalid email."
          />
          <Input label="Disabled" placeholder="Read-only field" disabled />
          <Textarea
            label="Note"
            placeholder="Lease notes, special requests…"
            hint="Saved to the resident record in ResMan."
          />
        </div>
      </section>

      {/* ---------- Badges ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Badges</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          5 colors × 2 sizes · optional leading dot · optional closable.
        </p>

        <div style={{ marginTop: 'var(--ui-sp-16)', display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-12)' }}>
          <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 80 }}>sm</span>
            <Badge color="grey">Grey</Badge>
            <Badge color="brand">Brand</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="warn">Warn</Badge>
            <Badge color="error">Error</Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 80 }}>md</span>
            <Badge color="grey" size="md">Grey</Badge>
            <Badge color="brand" size="md">Brand</Badge>
            <Badge color="success" size="md">Success</Badge>
            <Badge color="warn" size="md">Warn</Badge>
            <Badge color="error" size="md">Error</Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 80 }}>unit status</span>
            <Badge color="success" dot>Occupied</Badge>
            <Badge color="brand" dot>Vacant</Badge>
            <Badge color="brand" dot>Vacant Leased</Badge>
            <Badge color="warn" dot>NTV</Badge>
            <Badge color="warn" dot>NTV Leased</Badge>
            <Badge color="error" dot>Under Eviction</Badge>
            <Badge color="grey" dot>Off Market</Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 80 }}>lease</span>
            <Badge color="grey" dot>Current</Badge>
            <Badge color="warn" dot>Pending Renewal</Badge>
            <Badge color="success" dot>Renewed</Badge>
            <Badge color="warn" dot>NTV</Badge>
            <Badge color="error" dot>Former</Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 80 }}>filter chips</span>
            <Badge color="brand" onRemove={() => void 0}>EAST</Badge>
            <Badge color="brand" onRemove={() => void 0}>MP</Badge>
            <Badge color="grey" onRemove={() => void 0}>Vacant Ready</Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 80 }}>w/ icon</span>
            <Badge color="brand" trailingIcon={<IconPencil />}>Edit lease</Badge>
            <Badge color="success" leadingIcon={<IconPencil />}>Renewed</Badge>
            <Badge color="warn" trailingIcon={<IconPencil />}>Needs NTV</Badge>
          </div>
        </div>
      </section>

      {/* ---------- StatusBadge: badge + dropdown for quick status change ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">StatusBadge — quick status change from the table</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Click any badge below to open the dropdown and pick a new status. In production this replaces the Status
          column of the applicants table, so leasing staff can advance a prospect a step without opening the full modal.
        </p>

        <div
          style={{
            marginTop: 'var(--ui-sp-16)',
            padding: 'var(--ui-sp-16)',
            background: 'var(--ui-bg-secondary)',
            border: '1px solid var(--ui-border-primary)',
            borderRadius: 'var(--ui-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ui-sp-16)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 120 }}>Standalone</span>
            <StatusBadge value={demoStatus} onChange={setDemoStatus} />
            <span className="ui-text-xs ui-text-tertiary">
              Current: <code>{demoStatus}</code>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-8)' }}>
            <span className="ui-text-xs ui-text-tertiary">Faux table rows — click any Status cell to change it:</span>
            <table className="ui-faux-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Applicant</th>
                  <th>Rent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { unit: 'EAST · 47B1',  name: 'Luciana Philippe',   rent: 1850 },
                  { unit: 'MP · 5540C',   name: 'Dieuluc Jean-Louis', rent: 1725 },
                  { unit: 'ROP · 201A',   name: 'Marcus Harris',      rent: 1980 },
                  { unit: 'TV · 112',     name: 'Keisha Johnson',     rent: 1620 },
                  { unit: '49thStr · 803', name: 'Jamal Carter',       rent: 2140 },
                ].map((r, i) => (
                  <tr key={r.unit}>
                    <td><strong>{r.unit}</strong></td>
                    <td>{r.name}</td>
                    <td className="num">{fmtUsd(r.rent)}</td>
                    <td><StatusBadge value={rowStatuses[i]!} onChange={(next) => setRow(i, next)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 120 }}>Read-only</span>
            <StatusBadge value="signed" />
            <span className="ui-text-xs ui-text-tertiary">(no onChange → no dropdown, no chevron)</span>
          </div>
        </div>
      </section>

      {/* ---------- Cards: KPI grid preview ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">KPI tiles — dashboard preview</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Portfolio-level numbers across the 9 SNS properties. Click any tile — the interactive variant will drive
          filters when wired to the real dashboard.
        </p>
        <div
          style={{
            marginTop: 'var(--ui-sp-16)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--ui-sp-16)',
          }}
        >
          <KpiCard
            label="Occupancy"
            value="94.2%"
            sub="1,142 of 1,212 units occupied"
            tone="success"
            trend={{ dir: 'up', value: '0.8pp' }}
            onClick={() => void 0}
          />
          <KpiCard
            label="Renewal rate · October"
            value="68%"
            sub="42 renewed of 62 expiring"
            tone="brand"
            trend={{ dir: 'up', value: '4pp' }}
            onClick={() => void 0}
          />
          <KpiCard
            label="Pending applicants"
            value="23"
            sub="7 pending approval · 11 approved · 5 signed"
            tone="warn"
            trend={{ dir: 'up', value: '18%' }}
            onClick={() => void 0}
          />
          <KpiCard
            label="Signed leases MTD"
            value="31"
            sub="New leases this month (excl. renewals)"
            trend={{ dir: 'up', value: '12%' }}
          />
          <KpiCard
            label="Vacant units"
            value="48"
            sub="29 ready · 19 not ready"
            tone="error"
            trend={{ dir: 'down', value: '6%' }}
            onClick={() => void 0}
          />
          <KpiCard
            label="Expiring in 60 days"
            value="38"
            sub="9 without NTV filed · 4 renewal not signed"
            tone="warn"
          />
        </div>
      </section>

      {/* ---------- Cards: composition ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Card composition</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Header + body + footer, plus a nested card showing a subtler surface.
        </p>
        <div style={{ marginTop: 'var(--ui-sp-16)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--ui-sp-16)' }}>
          <Card>
            <CardHeader
              title="EAST · 47B1"
              subtitle="Luciana Philippe · lease ends 2026-12-18"
              actions={
                <Button size="sm" hierarchy="tertiary" iconOnly aria-label="Edit unit">
                  <IconPencil />
                </Button>
              }
            />
            <div className="ui-text-sm ui-text-secondary" style={{ lineHeight: 'var(--ui-lh-md)' }}>
              2 Bed · 2 Bath · 1,145 sqft<br />
              Rent $1,850/mo · Deposit $1,850 · Signed Aug 28
            </div>
            <CardFooter align="between">
              <span className="ui-text-xs ui-text-tertiary">Pending Renewal</span>
              <Button size="sm" hierarchy="secondary">Open in ResMan</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader
              title="ResMan sync log"
              actions={
                <Button size="sm" hierarchy="tertiary" iconOnly aria-label="Expand full log">
                  <IconExpand />
                </Button>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-8)' }}>
              <Card nested padding="sm">
                <div className="ui-text-xs ui-text-tertiary">Oct 24 · 15:42</div>
                <div className="ui-text-sm">Dashboard refresh completed · 9 properties</div>
              </Card>
              <Card nested padding="sm">
                <div className="ui-text-xs ui-text-tertiary">Oct 24 · 09:00</div>
                <div className="ui-text-sm">Pulled 1,212 units from /Units/Availability</div>
              </Card>
            </div>
          </Card>
        </div>
      </section>

      {/* ---------- Modals ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Modals</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Open any — Esc or backdrop click dismisses. Four sizes plus a destructive-confirm pattern and an inline form.
        </p>
        <div style={{ display: 'flex', gap: 'var(--ui-sp-12)', marginTop: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
          <Button hierarchy="secondary" onClick={() => setOpenModal('sm')}>Small (400px)</Button>
          <Button hierarchy="secondary" onClick={() => setOpenModal('md')}>Medium (480px)</Button>
          <Button hierarchy="secondary" onClick={() => setOpenModal('lg')}>Large (544px)</Button>
          <Button hierarchy="destructive" onClick={() => setOpenModal('confirm')}>Confirm destructive</Button>
          <Button hierarchy="primary" onClick={() => setOpenModal('form')}>Inline form</Button>
        </div>
      </section>

      {/* Modal instances */}
      <Modal open={openModal === 'sm'} onClose={() => setOpenModal(null)} size="sm">
        <ModalHeader title="Approve applicant" subtitle="400px wide — short confirmations." onClose={() => setOpenModal(null)} />
        <ModalBody>Approve Luciana Philippe for EAST · 47B1?</ModalBody>
        <ModalFooter>
          <Button hierarchy="secondary" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button hierarchy="primary" onClick={() => setOpenModal(null)}>Approve</Button>
        </ModalFooter>
      </Modal>

      <Modal open={openModal === 'md'} onClose={() => setOpenModal(null)} size="md">
        <ModalHeader
          title="NTV filed"
          subtitle="Posted to ResMan and the dashboard."
          icon={<IconMail />}
          tone="success"
          onClose={() => setOpenModal(null)}
        />
        <ModalBody>
          <p className="ui-text-md" style={{ color: 'var(--ui-text-primary)' }}>
            EAST · 47B1 — Luciana Philippe
          </p>
          <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
            Move-out date: 2026-12-18 · Date Available auto-set to 2027-01-05
          </p>
        </ModalBody>
        <ModalFooter align="between">
          <span className="ui-text-xs ui-text-tertiary">Synced with ResMan · 2m ago</span>
          <Button hierarchy="primary" onClick={() => setOpenModal(null)}>Got it</Button>
        </ModalFooter>
      </Modal>

      <Modal open={openModal === 'lg'} onClose={() => setOpenModal(null)} size="lg">
        <ModalHeader title="Lease history — EAST · 47B1" subtitle="Last 5 events" onClose={() => setOpenModal(null)} />
        <ModalBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-12)' }}>
            {[
              { when: 'Oct 24 · 15:42', what: 'Renewal letter sent via ResMan' },
              { when: 'Oct 20 · 09:15', what: 'Pending Renewal flag added' },
              { when: 'Sep 02 · 11:12', what: 'Resident Luciana Philippe moved in' },
              { when: 'Aug 28 · 10:30', what: 'Lease signed · $1,850/mo' },
              { when: 'Aug 18 · 14:00', what: 'Application approved' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--ui-sp-12)' }}>
                <span className="ui-text-xs ui-text-tertiary" style={{ width: 130 }}>{e.when}</span>
                <span className="ui-text-sm">{e.what}</span>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button hierarchy="tertiary" onClick={() => setOpenModal(null)}>Close</Button>
          <Button hierarchy="primary" onClick={() => setOpenModal(null)}>Export history</Button>
        </ModalFooter>
      </Modal>

      <Modal open={openModal === 'confirm'} onClose={() => setOpenModal(null)} size="sm">
        <ModalHeader
          title="File eviction for 3 units?"
          subtitle="Posts to ResMan immediately."
          icon={<IconPencil />}
          tone="error"
          onClose={() => setOpenModal(null)}
        />
        <ModalBody>
          The 3 selected units each have 60+ days of unpaid rent. Filing eviction kicks off the formal process in
          ResMan — this cannot be undone from the dashboard.
        </ModalBody>
        <ModalFooter>
          <Button hierarchy="secondary" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button hierarchy="destructive" onClick={() => setOpenModal(null)}>File eviction</Button>
        </ModalFooter>
      </Modal>

      <Modal open={openModal === 'form'} onClose={() => setOpenModal(null)} size="lg">
        <ModalHeader title="Edit resident contact" subtitle="Saved to ResMan on submit." onClose={() => setOpenModal(null)} />
        <ModalBody>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-sp-16)' }}>
            <Input label="First name" defaultValue="Luciana" />
            <Input label="Last name" defaultValue="Philippe" />
            <Input label="Email" type="email" defaultValue="luciana.philippe@example.com" />
            <Input label="Phone" defaultValue="(305) 555-0142" />
            <Input label="Unit" defaultValue="47B1" />
            <Input label="Property" defaultValue="EAST" />
          </div>
          <div style={{ marginTop: 'var(--ui-sp-16)' }}>
            <Textarea label="Notes" rows={2} placeholder="Lease amendments, special requests, etc." />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button hierarchy="secondary" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button hierarchy="primary" onClick={() => setOpenModal(null)}>Save resident</Button>
        </ModalFooter>
      </Modal>

      {/* ---------- Select + MultiSelect + Dropdown ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Select + Dropdown</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Form-field Select with single + multi variants, plus the raw Dropdown primitive used in StatusBadge and bulk actions.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--ui-sp-24)', marginTop: 'var(--ui-sp-16)' }}>
          <Select
            label="Estado"
            placeholder="Elegir estado…"
            options={STATUS_OPTIONS}
            value={selectValue}
            onChange={setSelectValue}
            hint="Un sólo valor"
          />
          <MultiSelect
            label="Properties"
            options={PROPERTY_OPTIONS}
            value={multiValue}
            onChange={setMultiValue}
            hint="Filter by portfolio properties"
          />
          <div>
            <span className="ui-field-label" style={{ display: 'block', marginBottom: 'var(--ui-sp-6)' }}>Acciones</span>
            <Dropdown
              trigger={<Button hierarchy="secondary" size="md" trailingIcon={<IconArrow />}>Resident actions</Button>}
              align="left"
            >
              <DropdownItem leadingIcon={<IconPencil />}>Edit resident</DropdownItem>
              <DropdownItem leadingIcon={<IconMail />}>Send renewal letter</DropdownItem>
              <DropdownItem leadingIcon={<IconRefresh />}>File NTV</DropdownItem>
              <DropdownDivider />
              <DropdownItem leadingIcon={<IconLogout />} danger>File eviction</DropdownItem>
            </Dropdown>
          </div>
        </div>
      </section>

      {/* ---------- Searchable Select + MultiSelect with Select-all + DatePicker ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Select — searchable + bulk actions + date pickers</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Add <code>searchable</code> to filter a long options list. Add <code>showSelectAll</code> on MultiSelect
          for Seleccionar todo / Limpiar buttons. DatePicker + DateRangePicker use the same shell as Select.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--ui-sp-24)', marginTop: 'var(--ui-sp-16)' }}>
          <Select
            label="SKU (buscable)"
            options={BIG_OPTIONS}
            value={searchableValue}
            onChange={setSearchableValue}
            searchable
            placeholder="Buscar SKU…"
          />
          <MultiSelect
            label="SKUs — todo / limpiar"
            options={BIG_OPTIONS}
            value={multiAllValue}
            onChange={setMultiAllValue}
            searchable
            showSelectAll
            hint="Combina Buscar + Seleccionar todo (del filtro visible)"
          />
          <DatePicker
            label="Fecha de entrega"
            value={dateValue}
            onChange={setDateValue}
            hint="Hoy aparece con un borde verde."
          />
          <DateRangePicker
            label="Rango de fechas"
            value={rangeValue}
            onChange={setRangeValue}
            hint="Click en dos días para fijar el rango."
          />
        </div>
      </section>

      {/* ---------- ChipGroup — flat row of toggle pills ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">ChipGroup — flat toggle chips</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Pill-shaped chips in a row. Click to toggle; active chips get brand-green outline + tinted bg.
          <code>single</code> flips the whole row to radio-style (one at a time).
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-24)', marginTop: 'var(--ui-sp-16)' }}>
          <ChipGroup
            label="Features (multi)"
            options={CHIP_OPTIONS}
            value={chipValue}
            onChange={setChipValue}
            showSelected
          />
          <ChipGroup
            label="Unit type (single — one value only)"
            options={UNIT_TYPE_OPTIONS}
            value={chipSingle}
            onChange={setChipSingle}
            single
            showSelected
          />
          <ChipGroup
            label="Features — tamaño sm"
            options={CHIP_OPTIONS}
            value={chipValue}
            onChange={setChipValue}
            size="sm"
          />
        </div>
      </section>

      {/* ---------- Tooltips ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Tooltips</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Hover any element below. Short text labels for icon buttons; rich content for data points.
        </p>

        <div style={{ marginTop: 'var(--ui-sp-16)', display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-20)' }}>
          <div>
            <span className="ui-text-xs ui-text-tertiary" style={{ display: 'block', marginBottom: 'var(--ui-sp-8)' }}>Icon-button labels (topbar pattern)</span>
            <div style={{ display: 'flex', gap: 'var(--ui-sp-4)', alignItems: 'center' }}>
              <Tooltip content="Refresh"><Button hierarchy="tertiary" size="sm" iconOnly aria-label="Refresh"><IconRefresh /></Button></Tooltip>
              <Tooltip content="Light / dark mode"><Button hierarchy="tertiary" size="sm" iconOnly aria-label="Theme"><IconSun /></Button></Tooltip>
              <Tooltip content="Account settings"><Button hierarchy="tertiary" size="sm" iconOnly aria-label="Settings"><IconSettings /></Button></Tooltip>
              <Tooltip content="Sign out" side="bottom"><Button hierarchy="tertiary" size="sm" iconOnly aria-label="Logout"><IconLogout /></Button></Tooltip>
            </div>
          </div>

          <div>
            <span className="ui-text-xs ui-text-tertiary" style={{ display: 'block', marginBottom: 'var(--ui-sp-8)' }}>Sides</span>
            <div style={{ display: 'flex', gap: 'var(--ui-sp-16)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Tooltip side="top" content="Top"><Button hierarchy="secondary" size="sm">Top</Button></Tooltip>
              <Tooltip side="bottom" content="Bottom"><Button hierarchy="secondary" size="sm">Bottom</Button></Tooltip>
              <Tooltip side="left" content="Left"><Button hierarchy="secondary" size="sm">Left</Button></Tooltip>
              <Tooltip side="right" content="Right"><Button hierarchy="secondary" size="sm">Right</Button></Tooltip>
            </div>
          </div>

          <div>
            <span className="ui-text-xs ui-text-tertiary" style={{ display: 'block', marginBottom: 'var(--ui-sp-8)' }}>Chart data point (rich content)</span>
            {/* SVG draws the line; HTML dots sit on top as positioned spans so they
                can live inside a <Tooltip> wrapper. SVG won't render HTML children. */}
            <div style={{ position: 'relative', width: 420, height: 110, background: 'var(--ui-bg-tertiary)', borderRadius: 'var(--ui-radius-md)', border: '1px solid var(--ui-border-primary)' }}>
              <svg width="420" height="110" viewBox="0 0 420 110" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
                <polyline fill="none" stroke="var(--ui-brand-500)" strokeWidth="2" points="20,80 80,60 140,70 200,40 260,50 320,20 380,30" />
              </svg>
              {[
                { x: 20,  y: 80, date: '08 Oct', value: 38500, delta: '-'    },
                { x: 80,  y: 60, date: '09 Oct', value: 42800, delta: '+11%' },
                { x: 140, y: 70, date: '10 Oct', value: 40200, delta: '-6%'  },
                { x: 200, y: 40, date: '11 Oct', value: 51400, delta: '+28%' },
                { x: 260, y: 50, date: '12 Oct', value: 48900, delta: '-5%'  },
                { x: 320, y: 20, date: '13 Oct', value: 57300, delta: '+17%' },
                { x: 380, y: 30, date: '14 Oct', value: 54600, delta: '-5%'  },
              ].map((p) => (
                <span
                  key={p.date}
                  style={{ position: 'absolute', left: p.x - 6, top: p.y - 6, width: 12, height: 12 }}
                >
                  <Tooltip
                    side="top"
                    maxWidth={220}
                    content={
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--ui-text-tertiary)' }}>{p.date}</span>
                        <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtUsd(p.value)}</strong>
                        <span style={{
                          color: p.delta.startsWith('+') ? 'var(--ui-success-500)' : p.delta.startsWith('-') ? 'var(--ui-error-500)' : 'var(--ui-text-tertiary)',
                          fontVariantNumeric: 'tabular-nums',
                        }}>{p.delta}</span>
                      </span>
                    }
                  >
                    <span
                      style={{
                        display: 'block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'var(--ui-bg-primary)',
                        border: '2px solid var(--ui-brand-500)',
                        cursor: 'help',
                      }}
                    />
                  </Tooltip>
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="ui-text-xs ui-text-tertiary" style={{ display: 'block', marginBottom: 'var(--ui-sp-8)' }}>Info icon beside a label (ayuda contextual)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-8)' }}>
              <span className="ui-text-sm">Pre-tax rent cap</span>
              <Tooltip
                side="right"
                content="Market rent before any concession, loyalty discount, or non-rent charges (pet, parking, W/D). Used to compare YoY rent growth across properties."
                maxWidth={280}
              >
                <span style={{ display: 'inline-flex', width: 16, height: 16, borderRadius: '50%', background: 'var(--ui-grey-700)', color: '#fff', fontSize: 11, alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>?</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SegmentedControl + ToggleButtonGroup ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Segmented control + Toggle group</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Pill-shaped segmented for mode switches (iOS style). Toggle group for row-of-chips picks.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-16)', marginTop: 'var(--ui-sp-16)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 140 }}>Segmented sm</span>
            <SegmentedControl options={SEG_OPTIONS} value={segValue} onChange={setSegValue} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 140 }}>Segmented md</span>
            <SegmentedControl options={PERIOD_OPTIONS} value={tbgSingle} onChange={setTbgSingle} size="md" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 140 }}>Toggle group (single)</span>
            <ToggleButtonGroup options={PERIOD_OPTIONS} value={tbgSingle} onChange={(v) => setTbgSingle(v as string)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)', flexWrap: 'wrap' }}>
            <span className="ui-text-xs ui-text-tertiary" style={{ width: 140 }}>Toggle group (multi)</span>
            <ToggleButtonGroup options={DAYS} value={tbgMulti} onChange={(v) => setTbgMulti(v as string[])} multiple />
          </div>
        </div>
      </section>

      {/* ---------- Checkbox + Radio + Toggle ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Checkbox · Radio · Toggle</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Native-feel binary and single-choice inputs. Checkbox has an indeterminate state (half-set).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--ui-sp-24)', marginTop: 'var(--ui-sp-16)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-10)' }}>
            <span className="ui-field-label">Checkbox</span>
            <Checkbox
              checked={cb1}
              onChange={(e) => setCb1(e.target.checked)}
              label="Pre-fill resident contact"
              hint="Reuses details for the next co-tenant on the lease."
            />
            <Checkbox
              checked={cb2}
              onChange={(e) => setCb2(e.target.checked)}
              label="Send renewal email"
            />
            <Checkbox indeterminate label="Indeterminate" />
            <Checkbox disabled label="Disabled" />
            <Checkbox size="md" checked={cb1} onChange={(e) => setCb1(e.target.checked)} label="Size md" />
          </div>

          <div>
            <RadioGroup
              label="Renewal offer type"
              name="renewal"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'andreani', label: 'Market rent',   hint: 'Match the current market offer sheet' },
                { value: 'moto',     label: 'Loyalty',       hint: '2% off market for 2+ year residents' },
                { value: 'retiro',   label: 'Flat renewal',  hint: 'Same rent as current lease' },
                { value: 'otro',     label: 'Custom',        disabled: true },
              ]}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-10)' }}>
            <span className="ui-field-label">Toggle switch</span>
            <Toggle
              checked={sw1}
              onChange={(e) => setSw1(e.target.checked)}
              label="Alert notifications"
              hint="New NTVs, pending approvals, lease events."
            />
            <Toggle
              checked={sw2}
              onChange={(e) => setSw2(e.target.checked)}
              label="Dark mode"
              size="md"
            />
            <Toggle
              disabled
              label="Disabled"
            />
          </div>
        </div>
      </section>

      {/* ---------- Table ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
          <div>
            <h2 className="ui-text-lg ui-fw-semibold">Table</h2>
            <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
              Click headers (Unit, Property, Applicant, App Date, Rent) to sort. Check rows to see the sticky summary
              footer update. Click any Status badge to open the inline status dropdown. Rows are clickable (shows an alert).
            </p>
          </div>
          <Button
            hierarchy="secondary-color"
            size="sm"
            leadingIcon={<IconAlert />}
            onClick={() => setTableAlertsOpen(true)}
          >
            View alerts · 2
          </Button>
        </div>

        <AlertsPopup
          open={tableAlertsOpen}
          onClose={() => setTableAlertsOpen(false)}
          title="Applicant alerts"
          dotColor="amber"
          alerts={[
            { id: 'ta1', property: 'EAST', category: 'Pending – Real Unit',        unit: '47B1', resident: 'Luciana Philippe', alertMsg: 'Pending applicant assigned to a real unit', daysAgo: 2 },
            { id: 'ta2', property: 'MP',   category: 'Approved + Paid in Holding', unit: '5540C', resident: 'Dieuluc Jean-Louis', alertMsg: 'Approved + deposit paid, still in Holding Unit', daysAgo: 5 },
          ]}
        />
        <div style={{ marginTop: 'var(--ui-sp-16)' }}>
          <Table
            columns={tableColumns}
            rows={sortedRows}
            getRowId={(o) => o.id}
            selectedIds={tableSelected}
            onToggle={(id) => {
              setTableSelected((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              });
            }}
            onToggleAll={() => {
              setTableSelected((prev) => {
                const allIds = sortedRows.map((o) => o.id);
                const allSelected = allIds.every((id) => prev.has(id));
                return new Set(allSelected ? [] : allIds);
              });
            }}
            sort={tableSort}
            onSort={setTableSort}
            onRowClick={(o) => alert(`Click on ${o.property} · ${o.unit} — ${o.applicant}`)}
            height={360}
            footer={
              tableSelected.size === 0 ? (
                <span className="ui-table-summary-empty">Select rows to see totals and averages.</span>
              ) : (
                <>
                  <div className="ui-table-summary-cell">
                    <span>Selected</span>
                    <span>{tableSelected.size}</span>
                  </div>
                  <div className="ui-table-summary-divider" />
                  <div className="ui-table-summary-cell ui-table-summary-cell-accent">
                    <span>Monthly rent</span>
                    <span>{fmtUsd(sumRent)}</span>
                  </div>
                  <div className="ui-table-summary-cell">
                    <span>Average rent</span>
                    <span>{fmtUsd(sumRent / tableSelected.size)}</span>
                  </div>
                  <div className="ui-table-summary-cell">
                    <span>Annualized</span>
                    <span>{fmtUsd(sumRent * 12)}</span>
                  </div>
                </>
              )
            }
          />
        </div>
      </section>

      {/* ---------- MatrixTable — the Daily Report shape ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Daily Report matrix</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          The per-property × per-metric grid that drives the dashboard. Regional column groups, sticky metric column,
          Portfolio total, divider rows, alt-row shading, alerted cells (hover for the alert message), clickable value
          cells wired to the <code>onCellClick</code> handler.
        </p>

        <div style={{ marginTop: 'var(--ui-sp-16)' }}>
          {(() => {
            // Mock SNS portfolio alerts for the matrix popup.
            const matrixAlerts: AlertItem[] = [
              { id: 'ma1', property: 'EAST', category: 'Vacant Not Ready', unit: '47B1', resident: '—', alertMsg: 'Vacant >14d without make-ready', daysAgo: 16 },
              { id: 'ma2', property: 'EAST', category: 'NTV',              unit: '5540C', resident: 'Dieuluc Jean-Louis', alertMsg: 'NTV filed, Date Available unset', daysAgo: 4 },
              { id: 'ma3', property: 'MUSO', category: 'Vacant Not Ready', unit: '201A', resident: '—', alertMsg: 'Vacant 8d, work order open', daysAgo: 8 },
              { id: 'ma4', property: 'TV',   category: 'NTV',              unit: '112',  resident: 'Keisha Johnson', alertMsg: 'NTV filed, no replacement applicant', daysAgo: 11 },
            ];

            return (
          <Card padding="sm">
            <CardHeader
              title="Portfolio status · all 9 properties"
              subtitle="Steel-blue tints · regional column groups · click a value to open its detail popup"
              actions={
                <Button
                  hierarchy="secondary-color"
                  size="sm"
                  leadingIcon={<IconAlert />}
                  onClick={() => setMatrixAlertsOpen(true)}
                >
                  View alerts · {matrixAlerts.length}
                </Button>
              }
            />
            {(() => {
              // Mock SNS portfolio shape for the demo.
              const sampleData: Record<string, { total: number; occupied: number; vacantReady: number; vacantNR: number; ntv: number; futureMI: number; futureMO: number; alert?: string }> = {
                ROP:     { total: 112, occupied: 108, vacantReady: 2, vacantNR: 1, ntv: 1, futureMI: 3, futureMO: 2 },
                TV:      { total: 128, occupied: 120, vacantReady: 4, vacantNR: 2, ntv: 2, futureMI: 5, futureMO: 3 },
                SJ:      { total: 96,  occupied: 92,  vacantReady: 1, vacantNR: 2, ntv: 1, futureMI: 2, futureMO: 2 },
                MUSO:    { total: 142, occupied: 134, vacantReady: 3, vacantNR: 3, ntv: 2, futureMI: 4, futureMO: 3 },
                MOC:     { total: 118, occupied: 112, vacantReady: 2, vacantNR: 2, ntv: 2, futureMI: 3, futureMO: 2 },
                EAST:    { total: 164, occupied: 150, vacantReady: 5, vacantNR: 4, ntv: 5, futureMI: 6, futureMO: 4, alert: 'Lease ends in 4d — no NTV filed' },
                ORT:     { total: 108, occupied: 103, vacantReady: 2, vacantNR: 2, ntv: 1, futureMI: 2, futureMO: 2 },
                '49thStr': { total: 186, occupied: 176, vacantReady: 4, vacantNR: 3, ntv: 3, futureMI: 5, futureMO: 4 },
                AP:      { total: 158, occupied: 147, vacantReady: 6, vacantNR: 3, ntv: 2, futureMI: 4, futureMO: 3 },
              };

              const columnGroups: ColumnGroup[] = [
                { label: 'Tampa',          abbrs: ['ROP', 'TV', 'SJ'],      tone: 'purple' },
                { label: 'Orlando',        abbrs: ['MUSO', 'MOC', 'EAST'],  tone: 'sky' },
                { label: 'Jacksonville',   abbrs: ['ORT', '49thStr'],       tone: 'teal' },
                { label: 'Ft. Lauderdale', abbrs: ['AP'],                   tone: 'rose' },
              ];

              const allAbbrs = columnGroups.flatMap((g) => g.abbrs);
              const sum = (field: keyof (typeof sampleData)[string]) =>
                allAbbrs.reduce((s, a) => s + (sampleData[a]![field] as number), 0);
              const totalUnits = sum('total');

              const rows: MatrixRow[] = [
                {
                  key: 'total', label: 'Total units', color: 'ui-matrix-text-primary',
                  getValue: (a) => sampleData[a]!.total,
                  getTotal: () => totalUnits,
                },
                {
                  key: 'occupied', label: 'Occupied',
                  color: 'ui-matrix-text-success',
                  getValue: (a) => sampleData[a]!.occupied,
                  getTotal: () => sum('occupied'),
                  popupCategory: 'occupied',
                },
                {
                  key: 'vacantReady', label: 'Vacant Ready',
                  color: 'ui-matrix-text-brand',
                  getValue: (a) => sampleData[a]!.vacantReady,
                  getTotal: () => sum('vacantReady'),
                  popupCategory: 'vacantReady',
                },
                {
                  key: 'vacantNR', label: 'Vacant Not Ready',
                  color: 'ui-matrix-text-warn',
                  getValue: (a) => sampleData[a]!.vacantNR,
                  getTotal: () => sum('vacantNR'),
                  popupCategory: 'vacantNotReady',
                  getAlert: (a) => (sampleData[a]!.alert && a === 'EAST') ? sampleData[a]!.alert! : null,
                },
                {
                  key: 'ntv', label: 'NTV',
                  color: 'ui-matrix-text-warn',
                  getValue: (a) => sampleData[a]!.ntv,
                  getTotal: () => sum('ntv'),
                  popupCategory: 'ntv',
                },
                { key: 'divider1', label: '', isDivider: true },
                {
                  key: 'occupancy', label: 'Occupancy',
                  color: 'ui-matrix-text-success',
                  isPercent: true,
                  getValue: (a) => ((sampleData[a]!.occupied / sampleData[a]!.total) * 100).toFixed(1),
                  getTotal: () => ((sum('occupied') / totalUnits) * 100).toFixed(1),
                },
                {
                  key: 'futureMI', label: 'Future MI',
                  color: 'ui-matrix-text-brand',
                  getValue: (a) => sampleData[a]!.futureMI,
                  getTotal: () => sum('futureMI'),
                },
                {
                  key: 'futureMO', label: 'Future MO',
                  color: 'ui-matrix-text-warn',
                  getValue: (a) => sampleData[a]!.futureMO,
                  getTotal: () => sum('futureMO'),
                },
              ];

              return (
                <MatrixTable
                  columnGroups={columnGroups}
                  rows={rows}
                  onCellClick={(cat, abbr) => {
                    toast({ tone: 'info', title: `Clicked ${cat} · ${abbr}`, description: 'In the real app this opens the detail popup.' });
                  }}
                />
              );
            })()}
          </Card>
            );
          })()}

          <AlertsPopup
            open={matrixAlertsOpen}
            onClose={() => setMatrixAlertsOpen(false)}
            title="Portfolio alerts"
            dotColor="red"
            alerts={[
              { id: 'ma1', property: 'EAST', category: 'Vacant Not Ready', unit: '47B1', resident: '—', alertMsg: 'Vacant >14d without make-ready', daysAgo: 16 },
              { id: 'ma2', property: 'EAST', category: 'NTV',              unit: '5540C', resident: 'Dieuluc Jean-Louis', alertMsg: 'NTV filed, Date Available unset', daysAgo: 4 },
              { id: 'ma3', property: 'MUSO', category: 'Vacant Not Ready', unit: '201A', resident: '—', alertMsg: 'Vacant 8d, work order open', daysAgo: 8 },
              { id: 'ma4', property: 'TV',   category: 'NTV',              unit: '112',  resident: 'Keisha Johnson', alertMsg: 'NTV filed, no replacement applicant', daysAgo: 11 },
            ]}
          />
        </div>
      </section>

      {/* ---------- Charts ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Charts</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Pure-SVG LineChart (multi-series, hover crosshair, area gradient) and DonutChart (hover highlights segment + updates center).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-24)', marginTop: 'var(--ui-sp-16)' }}>
          <Card>
            <CardHeader
              title="Occupancy · last 14 days"
              subtitle="Portfolio-wide, compared to the prior 14 days"
              actions={
                <Tooltip content="Expand"><Button hierarchy="tertiary" size="sm" iconOnly aria-label="Expand"><IconExpand /></Button></Tooltip>
              }
            />
            <LineChart
              formatValue={(n) => `${n.toFixed(1)}%`}
              series={[
                {
                  label: 'This period',
                  points: [
                    { label: '11', value: 93.1 },
                    { label: '12', value: 93.3 },
                    { label: '13', value: 93.4 },
                    { label: '14', value: 93.6 },
                    { label: '15', value: 93.6 },
                    { label: '16', value: 93.8 },
                    { label: '17', value: 93.9 },
                    { label: '18', value: 93.9 },
                    { label: '19', value: 94.0 },
                    { label: '20', value: 94.0 },
                    { label: '21', value: 94.1 },
                    { label: '22', value: 94.1 },
                    { label: '23', value: 94.2 },
                    { label: '24', value: 94.2 },
                  ],
                },
                {
                  label: 'Prior period',
                  color: 'var(--ui-text-tertiary)',
                  dashed: true,
                  noArea: true,
                  points: [
                    { label: '11', value: 91.8 },
                    { label: '12', value: 92.0 },
                    { label: '13', value: 92.1 },
                    { label: '14', value: 92.3 },
                    { label: '15', value: 92.4 },
                    { label: '16', value: 92.6 },
                    { label: '17', value: 92.7 },
                    { label: '18', value: 92.8 },
                    { label: '19', value: 92.9 },
                    { label: '20', value: 92.9 },
                    { label: '21', value: 93.0 },
                    { label: '22', value: 93.1 },
                    { label: '23', value: 93.2 },
                    { label: '24', value: 93.3 },
                  ],
                },
              ]}
            />
          </Card>

          <Card>
            <CardHeader
              title="Units by status"
              subtitle="1,212 units across the 9-property portfolio"
              actions={
                <Tooltip content="Expand"><Button hierarchy="tertiary" size="sm" iconOnly aria-label="Expand"><IconExpand /></Button></Tooltip>
              }
            />
            <DonutChart
              formatValue={(n) => String(n)}
              centerLabel="Total units"
              segments={[
                { label: 'Occupied',       value: 1142 },
                { label: 'Vacant Ready',   value: 29 },
                { label: 'Vacant Not Ready', value: 19 },
                { label: 'NTV',            value: 18 },
                { label: 'Under Eviction', value: 4 },
              ]}
            />
          </Card>

          <Card>
            <CardHeader
              title="Signed leases · last 14 days"
              subtitle="New leases only (excludes renewals)"
            />
            <LineChart
              formatValue={(n) => String(n)}
              series={[
                {
                  label: 'Signed',
                  points: [
                    { label: '11', value: 1 },
                    { label: '12', value: 2 },
                    { label: '13', value: 1 },
                    { label: '14', value: 3 },
                    { label: '15', value: 2 },
                    { label: '16', value: 4 },
                    { label: '17', value: 2 },
                    { label: '18', value: 1 },
                    { label: '19', value: 3 },
                    { label: '20', value: 2 },
                    { label: '21', value: 3 },
                    { label: '22', value: 2 },
                    { label: '23', value: 4 },
                    { label: '24', value: 1 },
                  ],
                },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* ---------- Alerts (inline banners) ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Alert — inline banners</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          For messaging that stays in the layout. Four tones + optional actions + dismissible.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-12)', marginTop: 'var(--ui-sp-16)' }}>
          <Alert tone="info" title="Dashboard refresh available" description="Last data pull was 4 hours ago. Click refresh to pull current ResMan data." />
          <Alert
            tone="success"
            title="Renewal letters sent"
            description="42 letters queued to ResMan for the November renewal batch."
            dismissible
            onDismiss={() => void 0}
          />
          <Alert
            tone="warn"
            title="Partners API running slow"
            description="ResMan /Leasing/Leases is returning in 8–12s per property. The refresh will take longer than usual."
            actions={<Button hierarchy="secondary" size="sm">Retry in 10s</Button>}
          />
          <Alert
            tone="error"
            title="Failed to post NTV"
            description="ResMan rejected: morDate (2026-12-18) is earlier than lease start. Fix the resident's move-out date before retrying."
            actions={<><Button hierarchy="secondary" size="sm">View detail</Button><Button hierarchy="destructive" size="sm">Mark as error</Button></>}
            dismissible
            onDismiss={() => void 0}
          />
        </div>
      </section>

      {/* ---------- Toasts ---------- */}
      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Toast — floating notifications</h2>
        <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
          Push via <code>useToast().toast(opts)</code>. Stack top-right, auto-dismiss after 5s, or set
          <code>sticky</code> to keep until the user closes.
        </p>
        <div style={{ display: 'flex', gap: 'var(--ui-sp-8)', marginTop: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
          <Button hierarchy="secondary" size="sm" onClick={() => toast({ tone: 'info', title: 'Info', description: 'Short informational note.' })}>Info</Button>
          <Button hierarchy="secondary" size="sm" onClick={() => toast({ tone: 'success', title: 'Saved', description: 'Resident contact pushed to ResMan.' })}>Success</Button>
          <Button hierarchy="secondary" size="sm" onClick={() => toast({ tone: 'warn', title: 'Attention', description: 'Date range exceeds 90 days.' })}>Warn</Button>
          <Button hierarchy="secondary" size="sm" onClick={() => toast({ tone: 'error', title: 'Error', description: 'ResMan API returned 502 — retry in a moment.' })}>Error</Button>
          <Button
            hierarchy="primary"
            size="sm"
            onClick={() =>
              toast({
                tone: 'success',
                title: '3 renewal letters sent',
                description: 'Queued to ResMan for November renewals · 1 preview still pending review.',
                actions: <Button hierarchy="tertiary-color" size="sm">Undo</Button>,
                sticky: true,
              })
            }
          >
            Sticky with action
          </Button>
          <Button
            hierarchy="tertiary"
            size="sm"
            onClick={() => {
              toast({ tone: 'info', title: 'Pulling EAST' });
              setTimeout(() => toast({ tone: 'info', title: 'Pulling MP' }), 400);
              setTimeout(() => toast({ tone: 'success', title: 'All 9 properties synced' }), 800);
            }}
          >
            Sequential stack
          </Button>
        </div>
      </section>

      <section style={{ marginTop: 'var(--ui-sp-32)' }}>
        <h2 className="ui-text-lg ui-fw-semibold">Next</h2>
        <ul style={{ marginTop: 'var(--ui-sp-12)', paddingLeft: 'var(--ui-sp-24)', color: 'var(--ui-text-secondary)' }}>
          <li className="ui-text-sm">Scaffold the SNS Next.js app, lift this kit into <code>src/ui/</code>, and wire the one-page portfolio report + per-property / per-region routes with employee auth.</li>
        </ul>
      </section>
    </div>
  );
}
