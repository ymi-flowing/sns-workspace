import './globals.css';
import '../tokens.css';
import { ToastProvider } from '../components/toast';
import { ThemeProvider } from '../components/theme-provider';

export const metadata = {
  title: 'UI Template',
  description: 'Neutral starter design system — change colors in tokens.css to brand.',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
