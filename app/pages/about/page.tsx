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
      <p className="text-sm font-medium text-cyan-700">App page</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">About Duneta</h1>
      <p className="text-lg leading-8 text-slate-600">
        Trang này nằm trong <code className="rounded bg-slate-100 px-1.5 py-0.5 text-cyan-800">app/pages/about/page.tsx</code>{' '}
        và override route mặc định từ package.
      </p>
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
        API health: {health}
      </p>
      <Link href="/datatable" className="text-cyan-700 hover:text-cyan-900">
        DataTable demo →
      </Link>
      <Link href="/" className="text-cyan-700 hover:text-cyan-900">
        ← Về trang chủ
      </Link>
    </main>
  );
}
