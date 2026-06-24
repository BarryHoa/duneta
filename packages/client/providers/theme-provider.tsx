import type { ThemeMode } from '../configs/types.js';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

type ThemeProviderProps = PropsWithChildren<{
  defaultTheme?: ThemeMode;
}>;

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme === 'system' ? 'system' : defaultTheme}
      enableSystem={defaultTheme === 'system'}
    >
      {children}
    </NextThemesProvider>
  );
}
