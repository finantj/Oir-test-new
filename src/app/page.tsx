const features = [
  {
    title: 'Unified decision canvas',
    description:
      'Fuse field intelligence, operational plans, and live telemetry into a single adaptive surface that everyone can trust.',
  },
  {
    title: 'Realtime signal routing',
    description:
      'Translate noise into prioritized alerts with contextual guardrails, so teams focus on what moves the mission.',
  },
  {
    title: 'Human + AI collaboration',
    description:
      'Capture expert intent, pair it with machine suggestions, and ship confident responses in minutes—not hours.',
  },
];

const playbook = [
  {
    name: 'Sense',
    summary: 'Connect to sensors, vendor APIs, and structured briefs. Oir normalizes everything out of the box.',
  },
  {
    name: 'Synthesize',
    summary: 'Layer intelligence with AI copilots that explain reasoning, spotlight risk, and recommend actions.',
  },
  {
    name: 'Act',
    summary: 'Trigger workflows, spin up new rooms, or export to your stack with rich audit trails ready to share.',
  },
];

const stats = [
  { label: 'Signals harmonized daily', value: '18k+' },
  { label: 'Automation coverage', value: '72%' },
  { label: 'Implementation timeline', value: '< 30 days' },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-[40%] h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <header className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-24 sm:pt-32">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            Private beta
          </span>
          <span className="text-sm text-slate-400">Request an invite to join the next cohort</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
              Operational intelligence that keeps pace with the world outside your window.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Oir gives complex operations teams a shared source of truth, pairing human context with AI assistance so they can orient, decide, and act faster than the situation evolves.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:translate-y-0.5 hover:bg-sky-400"
              >
                Book a walkthrough
              </a>
              <a
                href="#"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:text-white"
              >
                Explore the playbook
              </a>
            </div>
            <dl className="grid gap-6 text-sm text-slate-300 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <dt className="text-xs uppercase tracking-[0.28em] text-slate-400">{stat.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur">
              <div className="grid gap-6 p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Live cell</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Northern Response Desk</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    AI copilots summarize inbound chatter, highlight correlated anomalies, and suggest the next best action in real time.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs text-slate-400">Next recommended step</p>
                  <p className="mt-2 text-lg font-semibold text-sky-300">Spin up a logistics bridge with regional command</p>
                  <p className="mt-2 text-sm text-slate-300">
                    12 field units affected • Confidence 92%
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-3">
                    <span>Telemetry sync</span>
                    <span className="text-xs text-emerald-300">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-3">
                    <span>Analyst briefing</span>
                    <span className="text-xs text-yellow-300">Pending review</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-3">
                    <span>Policy routing</span>
                    <span className="text-xs text-sky-300">Auto-applied</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-lg shadow-black/30 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-4">
              <div className="h-10 w-10 rounded-full bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40" />
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">The Oir playbook</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Move from sensing to impact with a repeatable operational cadence.
            </h2>
            <p className="text-base text-slate-300">
              We help teams instrument their data, tune copilots, and design orchestration flows that feel native to their mission.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              Download the implementation guide
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="grid gap-6">
            {playbook.map((step, index) => (
              <div key={step.name} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="absolute right-6 top-6 text-6xl font-bold text-white/5">0{index + 1}</div>
                <p className="text-xs uppercase tracking-[0.34em] text-slate-400">{step.name}</p>
                <p className="mt-4 text-lg font-semibold text-white">{step.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-slate-500">Oir</p>
            <p className="mt-2 text-sm text-slate-400">Built for operators who need to see the whole board.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <a href="#" className="transition hover:text-slate-200">
              Product roadmap
            </a>
            <a href="#" className="transition hover:text-slate-200">
              Security brief
            </a>
            <a href="#" className="transition hover:text-slate-200">
              Careers
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
