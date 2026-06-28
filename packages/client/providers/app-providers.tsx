import type { ReactNode } from 'react';
import { DunetaToast } from '../components/DunetaToast/DunetaToast.js';
import { DunetaQueryProvider } from './query-provider.js';
import { DunetaThemeProvider } from './theme-provider.js';

export type DunetaAppProvidersProps = {
  children: ReactNode;
  defaultTheme?: 'dark' | 'light' | 'system';
};

export function DunetaAppProviders({ children, defaultTheme = 'light' }: DunetaAppProvidersProps) {
  return (
    <DunetaQueryProvider>
      <DunetaThemeProvider defaultTheme={defaultTheme}>
        <DunetaToast.Provider>
          {children}
        </DunetaToast.Provider>
      </DunetaThemeProvider>
    </DunetaQueryProvider>
  );
}
