// v2 Alert — inline banner. For "right here, right now" messaging that
// stays in the layout (toast is for ephemeral floating messages).
//
//   <Alert tone="success" title="Guardado" description="Se envió a Shopify." />
//   <Alert tone="warn" title="Atención" dismissible onDismiss={...} />
//   <Alert tone="error" title="Error" actions={<Button size="sm">Reintentar</Button>} />

import './alert.css';

type Tone = 'info' | 'success' | 'warn' | 'error';

export interface AlertProps {
  tone?: Tone;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

function IconDefault({ tone }: { tone: Tone }): React.ReactElement {
  if (tone === 'success') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <polyline points="8 12 11 15 16 9" />
      </svg>
    );
  }
  if (tone === 'warn') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (tone === 'error') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function IconClose(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="4" x2="4" y2="12" />
      <line x1="4" y1="4" x2="12" y2="12" />
    </svg>
  );
}

export function Alert({
  tone = 'info',
  title,
  description,
  icon,
  actions,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps): React.ReactElement {
  return (
    <div role="alert" className={`ui-alert ui-alert-${tone} ${className}`}>
      <span className="ui-alert-icon">{icon ?? <IconDefault tone={tone} />}</span>
      <div className="ui-alert-body">
        {title && <div className="ui-alert-title">{title}</div>}
        {description && <div className="ui-alert-desc">{description}</div>}
        {actions && <div className="ui-alert-actions">{actions}</div>}
      </div>
      {dismissible && (
        <button type="button" className="ui-alert-close" onClick={onDismiss} aria-label="Cerrar">
          <IconClose />
        </button>
      )}
    </div>
  );
}
