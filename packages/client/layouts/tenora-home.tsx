import {
  TenoraButton as Button,
  TenoraCard as Card,
  TenoraLayoutSection,
  TenoraLink as Link,
} from '../components';

const ArrowUpRight = () => <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = () => <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const foundations = [
  ['01', 'Web', 'React Router shell with a deliberately thin app layer.', 'app/web'],
  ['02', 'API', 'Hono API, ESM-first and ready for Node or Workers.', 'app/api'],
  ['03', 'Packages', 'Published client and server modules with clear boundaries.', '@tenora/*'],
] as const;

export function TenoraHome() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] px-5 pb-12 pt-5 text-slate-100 sm:px-8">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="relative mx-auto max-w-6xl">
        <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl sm:px-5">
          <Link href="#top" aria-label="Tenora home" className="gap-3 text-white hover:text-white">
            <span className="grid size-8 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">T</span>
            <span className="text-sm font-semibold tracking-[0.18em]">TENORA</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex" aria-label="Primary navigation">
            <Link href="#stack" className="text-slate-400 hover:text-white">Stack</Link>
            <Link href="#modules" className="text-slate-400 hover:text-white">Modules</Link>
            <Link href="#deploy" className="text-slate-400 hover:text-white">Deploy</Link>
            <Link href="/about" className="text-slate-400 hover:text-white">About</Link>
          </nav>
          <Link href="https://github.com/BarryHoa/Tenora" target="_blank" className="text-sm font-medium text-cyan-200 hover:text-white">GitHub <span aria-hidden="true">↗</span></Link>
        </header>

        <section id="top" className="grid gap-12 pb-20 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-100"><span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_3px_rgba(103,232,249,.5)]" />MODULAR TOOLKIT · ANY RUNTIME</div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">Build once.<br /><span className="text-gradient">Ship anywhere.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">A TypeScript starter where the React Router web app, Hono API, and publishable Tenora packages move as one.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="primary" onPress={() => document.querySelector('#stack')?.scrollIntoView({ behavior: 'smooth' })}>Explore the stack <ArrowUpRight /></Button>
              <Button variant="secondary" onPress={() => window.open('https://github.com/BarryHoa/Tenora', '_blank', 'noopener,noreferrer')}>View source</Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">{['React Router 8', 'Hono API', 'Cloudflare ready', 'ESM packages'].map((item) => <span key={item} className="flex items-center gap-2"><Check />{item}</span>)}</div>
          </div>

          <Card className="hero-console border border-white/10 bg-slate-950/60 shadow-2xl shadow-cyan-950/30">
            <Card.Header className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex gap-1.5" aria-hidden="true"><span className="size-2.5 rounded-full bg-rose-400/80" /><span className="size-2.5 rounded-full bg-amber-300/80" /><span className="size-2.5 rounded-full bg-emerald-300/80" /></div><Card.Description className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">tenora / workspace</Card.Description></Card.Header>
            <Card.Content className="space-y-5 p-5 sm:p-7">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Release status</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">Ready to compose</p></div><span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">All systems go</span></div>
              <div className="grid grid-cols-3 gap-3">{[['WEB', 'React Router'], ['API', 'Hono'], ['UI', 'HeroUI']].map(([label, item]) => <div key={label} className="rounded-xl border border-white/8 bg-white/[0.035] p-3"><p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-sm font-medium text-slate-200">{item}</p></div>)}</div>
              <div className="rounded-xl border border-cyan-300/10 bg-cyan-300/[0.045] p-4 font-mono text-sm leading-7 text-cyan-100"><span className="text-cyan-300">$</span> pnpm dev<br /><span className="text-emerald-300">✓</span> @tenora/client ready<br /><span className="text-emerald-300">✓</span> @tenora/server ready</div>
            </Card.Content>
          </Card>
        </section>

        <section id="stack" className="scroll-mt-8 border-t border-white/10 py-16">
          <TenoraLayoutSection>
            <TenoraLayoutSection.Header><div><p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">THE FOUNDATION</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">A stack with clear edges.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-400">Focused apps on top. Shared packages underneath. Nothing drifts.</p></TenoraLayoutSection.Header>
            <TenoraLayoutSection.Grid columns={3}>{foundations.map(([number, title, description, path]) => <Card key={title} className="group border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.06]"><Card.Header className="px-6 pb-1 pt-6"><Card.Description className="text-xs font-semibold tracking-[0.18em] text-cyan-200">{number}</Card.Description><Card.Title className="mt-5 text-xl font-semibold text-white">{title}</Card.Title></Card.Header><Card.Content className="px-6 pb-6 pt-3"><Card.Description className="min-h-12 leading-6 text-slate-400">{description}</Card.Description><div className="mt-6 inline-flex rounded-lg border border-white/10 bg-slate-950/50 px-2.5 py-1 font-mono text-xs text-slate-300">{path}</div></Card.Content></Card>)}</TenoraLayoutSection.Grid>
          </TenoraLayoutSection>
        </section>

        <section id="modules" className="py-8">
          <Card className="border border-white/10 bg-white/[0.035]"><Card.Content className="grid gap-6 p-7 md:grid-cols-[1fr_auto]"><div><p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">CLIENT MODULES</p><Card.Title className="mt-3 text-2xl font-semibold text-white">One UI package. Clear entrypoints.</Card.Title><Card.Description className="mt-3 max-w-2xl leading-7 text-slate-400">Use TenoraInput, TenoraSelect, TenoraForm, TenoraUpload, TenoraTable, TenoraLoadError and TenoraLayout independently—or import them all from the shared client barrel.</Card.Description></div><div className="flex flex-wrap content-start gap-2 md:max-w-64">{['TenoraInput', 'TenoraSelect', 'TenoraForm', 'TenoraUpload', 'TenoraTable', 'TenoraLoadError', 'TenoraLayout'].map((module) => <span key={module} className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-2.5 py-1.5 font-mono text-xs text-cyan-100">{module}</span>)}</div></Card.Content></Card>
        </section>

        <section id="deploy" className="grid gap-6 py-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center"><Card className="border border-white/10 bg-white/[0.035]"><Card.Content className="p-7"><p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">ONE WORKFLOW</p><Card.Title className="mt-3 text-2xl font-semibold text-white">Local by default.</Card.Title><Card.Description className="mt-3 leading-7 text-slate-400">Start the web UI and API together, then choose the production runtime when you are ready.</Card.Description></Card.Content></Card><div className="hidden size-10 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 lg:grid">→</div><Card className="border border-cyan-300/20 bg-cyan-300/[0.07]"><Card.Content className="p-7"><p className="text-xs font-semibold tracking-[0.18em] text-cyan-100">EVERYWHERE READY</p><Card.Title className="mt-3 text-2xl font-semibold text-white">Deploy with intent.</Card.Title><Card.Description className="mt-3 leading-7 text-slate-300">Cloudflare for global Workers, a VPS for Node, or split the web shell and API when you need scale.</Card.Description></Card.Content></Card></section>
      </div>
    </main>
  );
}
