// Portfolio report — SNS Workspace home.
//
// Phase 1 placeholder: proves the deploy pipeline + UI kit shell.
// Phase 2 will replace this with the real portfolio dashboard that
// reads data.json from the sns-daily-report repo and renders every
// section of the current report via the SNS UI kit (MatrixTable,
// KpiCard, LineChart, DonutChart, AlertsPopup).
'use client';

import Link from 'next/link';
import { Card, CardHeader, Button } from '../components';
import { useTheme } from '../components/theme-provider';

export default function Home(): React.ReactElement {
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 48, width: 48, background: '#ffffff', borderRadius: 'var(--ui-radius-md)', padding: 4 }}>
              <img src="/sns-logo.png" alt="SNS" style={{ height: '100%', width: 'auto', display: 'block' }} />
            </div>
            <h1 className="ui-display-sm">SNS Workspace</h1>
          </div>
          <p className="ui-text-md ui-text-secondary" style={{ marginTop: 'var(--ui-sp-8)' }}>
            Portfolio report + per-property / per-region views for the 9 SNS properties. Replaces the single-page HTML dashboard.
          </p>
        </div>
        <Button hierarchy="secondary" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
      </div>

      <div style={{ marginTop: 'var(--ui-sp-32)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--ui-sp-16)' }}>
        <Card>
          <CardHeader title="Portfolio report" subtitle="Coming in Phase 2 — reads data.json from the sns-daily-report pipeline." />
          <p className="ui-text-sm ui-text-secondary">
            The home page will show the portfolio status matrix, Traffic Month-to-Date, Traffic Snapshot, Expiring Leases,
            Renovation, Work Orders, Financial, and both alert bells — in parity with the current HTML dashboard.
          </p>
        </Card>

        <Card>
          <CardHeader title="UI kit showcase" subtitle="SNS components — brand swatches, inputs, charts, matrix, alerts." />
          <p className="ui-text-sm ui-text-secondary">
            Reference the full component library used by this app.
          </p>
          <div style={{ marginTop: 'var(--ui-sp-12)' }}>
            <Link href="/_showcase" style={{ color: 'var(--ui-brand-400)' }}>Open /_showcase →</Link>
          </div>
        </Card>
      </div>

      <p className="ui-text-xs ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-32)', textAlign: 'center' }}>
        Phase 1 — scaffold only. The dashboard at sns-daily-report.vercel.app is still the source of truth.
      </p>
    </div>
  );
}
