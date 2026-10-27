// v2 Modal — Untitled UI style: dark scrim, centered dialog with shadow-xl,
// optional featured-icon header, body, footer. Compose with ModalHeader /
// ModalBody / ModalFooter for structure.
//
//   <Modal open={open} onClose={...} size="md">
//     <ModalHeader title="Eliminar orden" subtitle="Esta acción es permanente." tone="error" />
//     <ModalBody>¿Estás seguro?</ModalBody>
//     <ModalFooter>
//       <Button hierarchy="secondary" onClick={close}>Cancelar</Button>
//       <Button hierarchy="destructive" onClick={confirm}>Eliminar</Button>
//     </ModalFooter>
//   </Modal>
'use client';

import { useEffect } from 'react';
import './modal.css';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  /** Set true to prevent backdrop-click / Esc dismiss (e.g. mid-submit). */
  preventClose?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  size = 'md',
  preventClose = false,
  children,
  className = '',
}: ModalProps): React.ReactElement | null {
  // Lock body scroll + Esc dismiss while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onEsc(e: KeyboardEvent): void {
      if (e.key === 'Escape' && !preventClose) onClose();
    }
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, preventClose, onClose]);

  if (!open) return null;

  return (
    <div
      className="ui-modal-backdrop"
      onClick={() => { if (!preventClose) onClose(); }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`ui-modal ui-modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ----- ModalHeader -----

type HeaderTone = 'neutral' | 'brand' | 'success' | 'warn' | 'error';

export interface ModalHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Icon shown in a tinted square to the left of the title. */
  icon?: React.ReactNode;
  tone?: HeaderTone;
  onClose?: () => void;
}

function IconX(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ModalHeader({ title, subtitle, icon, tone = 'neutral', onClose }: ModalHeaderProps): React.ReactElement {
  return (
    <div className="ui-modal-header">
      {icon && (
        <div className={`ui-modal-icon ui-modal-icon-${tone}`} aria-hidden>
          {icon}
        </div>
      )}
      <div className="ui-modal-header-text">
        <h2 className="ui-modal-title">{title}</h2>
        {subtitle && <p className="ui-modal-subtitle">{subtitle}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          className="ui-modal-close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <IconX />
        </button>
      )}
    </div>
  );
}

// ----- ModalBody -----

export function ModalBody({ children, className = '' }: { children: React.ReactNode; className?: string }): React.ReactElement {
  return <div className={`ui-modal-body ${className}`}>{children}</div>;
}

// ----- ModalFooter -----

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'between';
}

export function ModalFooter({ align = 'right', className = '', children, ...rest }: ModalFooterProps): React.ReactElement {
  return (
    <div className={`ui-modal-footer ui-modal-footer-${align} ${className}`} {...rest}>
      {children}
    </div>
  );
}
