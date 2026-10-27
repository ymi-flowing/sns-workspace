// v2 theme toggle — owns the active `data-theme` attribute on the scope and
// exposes a hook so any child can flip between dark + light. Persists in
// localStorage so the choice survives reloads.
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const STORAGE_KEY = 'ui-theme';

type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx>({
  theme: 'dark',
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme(): Ctx {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [hydrated, setHydrated] = useState(false);

  // Read saved preference on client mount.
  useEffect(() => {
    const stored = typeof window !== 'undefined'
      ? (window.localStorage.getItem(STORAGE_KEY) as Theme | null)
      : null;
    if (stored === 'light' || stored === 'dark') setThemeState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, hydrated]);

  function setTheme(t: Theme): void { setThemeState(t); }
  function toggle(): void { setThemeState((t) => (t === 'dark' ? 'light' : 'dark')); }

  return (
    <div className="ui-scope" data-theme={theme === 'light' ? 'light' : undefined}>
      <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </div>
  );
}
