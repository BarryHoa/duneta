import { DunetaButton as Button, DunetaLink as Link } from '../components';
import './duneta-home.css';

const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const pillars = [
  {
    step: '01',
    title: 'Worker',
    desc: 'Một entry xử lý web, API và static trên cùng domain.',
    path: 'app/worker.ts',
    tint: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  },
  {
    step: '02',
    title: 'Pages',
    desc: 'UI React Router của bạn — override defaults từ package.',
    path: 'app/pages',
    tint: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    step: '03',
    title: 'API',
    desc: 'Hono services và route groups dưới /api.',
    path: 'app/api',
    tint: 'bg-sky-50 text-sky-700 border-sky-100',
  },
] as const;

const modules = ['DunetaInput', 'DunetaDataTable', 'DunetaForm', 'DunetaUpload', 'DunetaSelect', 'DunetaLayout'];

const nav = [
  ['#stack', 'Stack'],
  ['#modules', 'Modules'],
  ['#deploy', 'Deploy'],
  ['/about', 'About'],
  ['/datatable', 'DataTable'],
] as const;

export function DunetaHome() {
  return (
    <main className="home">
      <div className="home-orb home-orb-a" aria-hidden="true" />
      <div className="home-orb home-orb-b" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
        {/* Nav */}
        <header className="home-fade-up home-card flex items-center justify-between rounded-2xl px-4 py-3 sm:px-5">
          <Link href="#top" aria-label="Duneta home" className="gap-2.5 font-semibold text-slate-900 hover:text-slate-900">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-sm font-bold text-white shadow-sm shadow-cyan-500/25">
              D
            </span>
            <span className="text-base tracking-tight">Duneta</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
            {nav.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="https://github.com/BarryHoa/Duneta"
            target="_blank"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            GitHub ↗
          </Link>
        </header>

        {/* Hero */}
        <section id="top" className="home-fade-up home-fade-up-delay-1 grid gap-12 pb-16 pt-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800">
              <span className="size-1.5 rounded-full bg-cyan-500" />
              One Worker · one deploy
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Full-stack TypeScript
              <br />
              <span className="home-gradient-text">on one domain.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              React Router cho pages, Hono cho{' '}
              <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-cyan-800">/api</code>
              — cùng origin, một Cloudflare Worker.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="primary"
                onPress={() => document.querySelector('#stack')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Khám phá stack <ArrowIcon />
              </Button>
              <Button
                variant="secondary"
                onPress={() => window.open('https://github.com/BarryHoa/Duneta', '_blank', 'noopener,noreferrer')}
              >
                Xem source
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-3 text-sm text-slate-600">
              {['React Router 8', 'Hono', 'Cloudflare Worker', '@duneta/*'].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal card */}
          <div className="home-card home-fade-up home-fade-up-delay-2 overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="home-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
                worker.ts
              </span>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { route: '/*', label: 'SSR pages', color: 'border-violet-100 bg-violet-50 text-violet-800' },
                  { route: '/api/*', label: 'Hono API', color: 'border-cyan-100 bg-cyan-50 text-cyan-800' },
                  { route: '/assets', label: 'Static', color: 'border-slate-200 bg-slate-50 text-slate-700' },
                ].map(({ route, label, color }) => (
                  <div key={route} className={`rounded-xl border p-3 text-center ${color}`}>
                    <p className="home-mono text-[10px] font-semibold opacity-70">{route}</p>
                    <p className="mt-1.5 text-xs font-medium sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
              <div className="home-terminal home-mono space-y-1 p-4 text-sm leading-7 text-slate-700">
                <p>
                  <span className="text-cyan-600">$</span> pnpm install && pnpm deploy
                </p>
                <p className="text-emerald-600">✓ build + wrangler deploy</p>
                <p>
                  <span className="text-slate-400">$</span> pnpm dev <span className="text-slate-400">→ :8787</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="scroll-mt-8 border-t border-slate-200/80 py-16">
          <div className="home-fade-up mb-10 max-w-2xl">
            <p className="text-sm font-medium text-cyan-700">Cấu trúc app</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Mọi thứ trong <code className="text-cyan-700">app/</code>
            </h2>
            <p className="mt-3 text-slate-600">Config, Worker, pages và API — một thư mục, một lệnh deploy.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {pillars.map(({ step, title, desc, path, tint }, i) => (
              <article
                key={title}
                className={`home-card home-fade-up rounded-2xl p-6 transition hover:-translate-y-0.5 ${i === 1 ? 'home-fade-up-delay-1' : i === 2 ? 'home-fade-up-delay-2' : ''}`}
              >
                <span className={`inline-flex rounded-lg border px-2 py-0.5 text-xs font-semibold ${tint}`}>
                  {step}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
                <code className="home-mono mt-5 inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  {path}
                </code>
              </article>
            ))}
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="py-4">
          <div className="home-card home-fade-up rounded-2xl p-7 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium text-cyan-700">UI kit</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Components sẵn dùng</h2>
                <p className="mt-3 max-w-xl text-slate-600">
                  Import từ <code className="rounded bg-slate-100 px-1 text-cyan-800">@duneta/client</code>, compose
                  trong <code className="rounded bg-slate-100 px-1 text-cyan-800">app/pages</code>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
                {modules.map((name) => (
                  <span
                    key={name}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 home-mono text-xs text-slate-700"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deploy */}
        <section id="deploy" className="grid gap-4 py-10 sm:grid-cols-2">
          <div className="home-card home-fade-up rounded-2xl p-7">
            <p className="text-sm font-medium text-slate-500">Local</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">pnpm dev</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Wrangler tại <code className="rounded bg-slate-100 px-1">localhost:8787</code>. Secrets từ{' '}
              <code className="rounded bg-slate-100 px-1">.dev.vars</code> — tự tạo lần đầu chạy.
            </p>
          </div>
          <div className="home-card home-fade-up home-fade-up-delay-1 rounded-2xl border-cyan-200/60 bg-gradient-to-br from-cyan-50/80 to-white p-7">
            <p className="text-sm font-medium text-cyan-700">Production</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">pnpm deploy</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sync, build và <code className="rounded bg-white/80 px-1">wrangler deploy</code> — web + API lên edge
              cùng một Worker.
            </p>
          </div>
        </section>

        <footer className="border-t border-slate-200/80 pt-8 text-center text-sm text-slate-500">
          Duneta — TypeScript full-stack on Cloudflare Workers
        </footer>
      </div>
    </main>
  );
}
