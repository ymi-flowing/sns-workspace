// v2 Toast — ephemeral floating messages that stack top-right. Wrap your
// subtree in <ToastProvider> and call useToast() to push messages:
//
//   const { toast } = useToast();
//   toast({ tone: 'success', title: 'Guardado', description: '...' });
//
// Pointer-events pass through the viewport so toasts never block clicks
// on the app behind them; individual toasts capture their own events.
'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from './alert';
import './toast.css';

type Tone = 'info' | 'success' | 'warn' | 'error';

export interface ToastOptions {
  tone?: Tone;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** ms before auto-dismiss. 0 = sticky. Default 5000. */
  duration?: number;
  /** Keep open until user clicks ×. */
  sticky?: boolean;
  /** Optional action buttons (e.g. "Deshacer"). */
  actions?: React.ReactNode;
}

type ToastItem = ToastOptions & { id: string };

type ToastContextValue = {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be used inside <ToastProvider>');
  }
  return ctx;
}

let seq = 0;

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const h = timers.current.get(id);
    if (h) { clearTimeout(h); timers.current.delete(id); }
  }, []);

  const toast = useCallback((opts: ToastOptions) => {
    const id = `t${++seq}`;
    const item: ToastItem = { ...opts, id };
    setItems((prev) => [...prev, item]);
    const sticky = !!opts.sticky;
    const dur = opts.duration ?? 5000;
    if (!sticky && dur > 0) {
      const h = setTimeout(() => dismiss(id), dur);
      timers.current.set(id, h);
    }
    return id;
  }, [dismiss]);

  const clear = useCallback(() => {
    setItems([]);
    timers.current.forEach((h) => clearTimeout(h));
    timers.current.clear();
  }, []);

  useEffect(() => () => { timers.current.forEach((h) => clearTimeout(h)); }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, clear }}>
      {children}
      <div className="ui-toast-viewport" role="region" aria-label="Notificaciones" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="ui-toast">
            <Alert
              tone={t.tone ?? 'info'}
              title={t.title}
              description={t.description}
              actions={t.actions}
              dismissible
              onDismiss={() => dismiss(t.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
