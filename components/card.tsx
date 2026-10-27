// v2 Card primitives — Untitled UI container pattern.
//
//   <Card>                   — plain surface
//   <Card interactive>       — hover + cursor, use with onClick / href
//   <CardHeader title="..">  — optional top row with title + actions slot
//   <CardFooter>             — optional bottom bar (right-aligned by default)
//   <KpiCard>                — preset for dashboard metric tiles
//
// All composition — not a monolith. Mix and match.

import './card.css';

type Padding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
  interactive?: boolean;
  /** When true, use a slightly lower bg so a Card inside a Card still reads. */
  nested?: boolean;
}

export function Card({
  padding = 'md',
  interactive = false,
  nested = false,
  className = '',
  children,
  ...rest
}: CardProps): React.ReactElement {
  const classes = [
    'ui-card',
    `ui-card-p-${padding}`,
    interactive && 'ui-card-interactive',
    nested && 'ui-card-nested',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, actions, className = '' }: CardHeaderProps): React.ReactElement {
  return (
    <div className={`ui-card-header ${className}`}>
      <div className="ui-card-header-text">
        {title && <h3 className="ui-card-title">{title}</h3>}
        {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="ui-card-actions">{actions}</div>}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'between';
}

export function CardFooter({ align = 'right', className = '', children, ...rest }: CardFooterProps): React.ReactElement {
  return (
    <div className={`ui-card-footer ui-card-footer-${align} ${className}`} {...rest}>
      {children}
    </div>
  );
}

// ----- KpiCard — convenience wrapper for dashboard metric tiles -----

function TrendArrow({ dir }: { dir: 'up' | 'down' | 'flat' }): React.ReactElement {
  if (dir === 'up') {
    return (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="3 7.5 6 4.5 9 7.5" />
      </svg>
    );
  }
  if (dir === 'down') {
    return (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="3 4.5 6 7.5 9 4.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="9" y2="6" />
    </svg>
  );
}

export interface KpiCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warn' | 'error';
  trend?: { dir: 'up' | 'down' | 'flat'; value: string };
  onClick?: () => void;
}

export function KpiCard({ label, value, sub, tone = 'neutral', trend, onClick }: KpiCardProps): React.ReactElement {
  return (
    <Card interactive={!!onClick} onClick={onClick} className={`ui-kpi ui-kpi-${tone}`}>
      <div className="ui-kpi-head">
        <span className="ui-kpi-label">{label}</span>
        {trend && (
          <span className="ui-kpi-trend">
            <TrendArrow dir={trend.dir} />
            <span>{trend.value}</span>
          </span>
        )}
      </div>
      <div className="ui-kpi-value">{value}</div>
      {sub && <div className="ui-kpi-sub">{sub}</div>}
    </Card>
  );
}
