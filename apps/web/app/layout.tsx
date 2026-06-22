import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@tenora/client/styles';

export const metadata: Metadata = {
  title: 'Tenora — ship your TypeScript stack',
  description: 'A portable TypeScript toolkit for Next.js and Hono.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
