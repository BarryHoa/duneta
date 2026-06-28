import type { ThemeMode } from '../configs/types.js';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

export type DunetaThemeProviderProps = PropsWithChildren<{
  defaultTheme?: ThemeMode;
}>;

export function DunetaThemeProvider({ children, defaultTheme = 'dark' }: DunetaThemeProviderProps) {
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

/** @deprecated Use `DunetaThemeProvider` */
export const ThemeProvider = DunetaThemeProvider;
