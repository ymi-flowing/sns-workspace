// Portfolio report — SNS Workspace home.
//
// Server component. Loads the dashboard snapshot (JSON pushed by the
// sns-daily-report Python pipeline every 4 hours) and renders each
// portfolio section via the SNS UI kit.

import Link from 'next/link';
import { Card, CardHeader } from '../components';
import { PortfolioMatrix } from './_sections/portfolio-matrix';
import { Traffic } from './_sections/traffic';
import { ExpiringLeases } from './_sections/expiring-leases';
import { loadSnapshot } from '../lib/data';

// Full ISR for the whole route: revalidate the fetch cache every 60s.
export const revalidate = 60;

export default async function Home(): Promise<React.ReactElement> {
  let snapshot;
  let loadError: string | null = null;
  try {
    snapshot = await loadSnapshot();
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err);
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--ui-sp-16)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 48, width: 48, background: '#ffffff', borderRadius: 'var(--ui-radius-md)', padding: 4 }}>
            <img src="/sns-logo.png" alt="SNS" style={{ height: '100%', width: 'auto', display: 'block' }} />
          </div>
          <div>
            <h1 className="ui-display-sm">SNS Workspace</h1>
            <p className="ui-text-sm ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-4)' }}>
              Portfolio report · {snapshot?.monthStr ?? '…'}
              {snapshot && <> · updated {new Date(snapshot.generatedAt).toLocaleString()}</>}
            </p>
          </div>
        </div>
        <Link
          href="/_showcase"
          className="ui-text-xs ui-text-tertiary"
          style={{ textDecoration: 'none', padding: 'var(--ui-sp-8) var(--ui-sp-12)', border: '1px solid var(--ui-border-primary)', borderRadius: 'var(--ui-radius-md)' }}
        >
          UI kit →
        </Link>
      </div>

      {/* Sections */}
      <div style={{ marginTop: 'var(--ui-sp-24)', display: 'flex', flexDirection: 'column', gap: 'var(--ui-sp-24)' }}>
        {loadError && (
          <Card>
            <CardHeader title="Snapshot load failed" subtitle="Falling back on an empty state" />
            <p className="ui-text-sm ui-text-error">{loadError}</p>
            <p className="ui-text-xs ui-text-tertiary" style={{ marginTop: 'var(--ui-sp-8)' }}>
              Make sure <code>data.json</code> is present on <code>ymi-flowing/sns-daily-report@main</code>.
              It's written on every run of the Refresh Dashboard action.
            </p>
          </Card>
        )}

        {snapshot && <PortfolioMatrix snapshot={snapshot} />}
        {snapshot && <Traffic snapshot={snapshot} />}
        {snapshot && <ExpiringLeases snapshot={snapshot} />}
      </div>
    </div>
  );
}
