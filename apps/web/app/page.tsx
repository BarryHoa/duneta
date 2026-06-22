import { appTheme } from '@tenora/client/themes';

export default function Home() {
  return (
    <main className={appTheme.page}>
      <h1>Tenora</h1>
      <p>Next.js UI connected to the Hono API.</p>
      <p>Next.js UI · Hono APIs · shared TypeScript core</p>
    </main>
  );
}
