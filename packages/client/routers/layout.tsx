import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { ThemeProvider } from '@tenora/client/providers';
import '@tenora/client/themes/globals.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider defaultTheme="dark">
          {children}
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout() {
  return <Outlet />;
}
