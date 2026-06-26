import { useEffect, useState } from 'react';
import { DunetaLink as Link } from '@duneta/client/components';
import { apiFetch } from '@duneta/client/hooks/use-api';

type HealthResponse = {
  ok: boolean;
  message: string;
};

export function meta() {
  return [{ title: 'About — Duneta' }];
}

export default function AboutPage() {
  const [health, setHealth] = useState<string>('Checking API…');

  useEffect(() => {
    apiFetch<HealthResponse>({ path: '/health' })
      .then((data) => setHealth(data.message))
      .catch(() => setHealth('API unavailable'));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-semibold tracking-[0.18em] text-cyan-200">APP ROUTE</p>
      <h1 className="text-4xl font-semibold text-white">About Duneta</h1>
      <p className="text-lg leading-8 text-slate-400">
        This page lives in <code className="text-cyan-100">app/web/routers/about/page.tsx</code> and
        overrides the default package routes.
      </p>
      <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-slate-200">
        API health: {health}
      </p>
      <Link href="/datatable" className="text-cyan-200 hover:text-white">
        DataTable demo →
      </Link>
      <Link href="/" className="text-cyan-200 hover:text-white">
        ← Back home
      </Link>
    </main>
  );
}
