import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../providers';
import '../themes/globals.css';

export const metadata: Metadata = {
  title: 'Tenora — ship your TypeScript stack',
  description: 'A portable TypeScript toolkit for Next.js and Hono.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
