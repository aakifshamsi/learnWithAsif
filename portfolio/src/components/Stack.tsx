import type { RefObject } from 'react';
import { useInView } from '../hooks/useInView';
import { SectionLabel } from './About';

const CATEGORIES = [
  {
    name: 'Edge & Cloud',
    color: 'accent',
    colorClass: 'text-accent border-accent/20 bg-accent/5',
    barClass: 'bg-accent',
    items: [
      { name: 'Cloudflare Workers', level: 95 },
      { name: 'Cloudflare D1 / KV / R2', level: 92 },
      { name: 'Durable Objects', level: 88 },
      { name: 'Workers AI', level: 85 },
      { name: 'Cloudflare Pages', level: 95 },
    ],
  },
  {
    name: 'Frontend',
    color: 'accent-2',
    colorClass: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    barClass: 'bg-purple-400',
    items: [
      { name: 'React 18 + TypeScript', level: 93 },
      { name: 'Vite + Tailwind CSS', level: 95 },
      { name: 'Plotly.js / D3.js', level: 80 },
      { name: 'Zustand / React Query', level: 88 },
      { name: 'React Router', level: 92 },
    ],
  },
  {
    name: 'Backend & APIs',
    color: 'accent-3',
    colorClass: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    barClass: 'bg-amber-400',
    items: [
      { name: 'Hono.js', level: 90 },
      { name: 'Node.js / Express', level: 88 },
      { name: 'Python / FastAPI', level: 82 },
      { name: 'REST + WebSockets', level: 90 },
      { name: 'Auth / JWT / OAuth', level: 85 },
    ],
  },
  {
    name: 'Infrastructure & Hardware',
    color: 'green',
    colorClass: 'text-green-400 border-green-400/20 bg-green-400/5',
    barClass: 'bg-green-400',
    items: [
      { name: 'Linux (Ubuntu/Debian)', level: 90 },
      { name: 'KVM / QEMU / libvirt', level: 82 },
      { name: 'Docker / Podman', level: 85 },
      { name: 'ESP32 / Arduino C++', level: 78 },
      { name: 'Ollama / local LLMs', level: 80 },
    ],
  },
];

const TOOLS = [
  'GitHub Actions', 'wrangler CLI', 'pnpm workspaces', 'VS Code', 'Neovim',
  'Postman', 'Wireshark', 'KiCad', 'Figma', 'Cloudflare Zero Trust',
];

export default function Stack() {
  const { ref, inView } = useInView();

  return (
    <section id="stack" ref={ref as RefObject<HTMLElement>} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel label="stack" />
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-12">
            Tools I{' '}
            <span className="text-gradient-cyan">actually use</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {CATEGORIES.map((cat, ci) => (
              <div key={cat.name}
                className="border-glow rounded-xl p-6 bg-surface/40 backdrop-blur-sm"
                style={{ transitionDelay: `${ci * 100}ms` }}
              >
                <h3 className={`font-mono text-sm font-semibold uppercase tracking-widest mb-5 ${cat.colorClass} border rounded-full px-3 py-1 inline-block`}>
                  {cat.name}
                </h3>
                <div className="space-y-4">
                  {cat.items.map((item, ii) => (
                    <SkillBar
                      key={item.name}
                      name={item.name}
                      level={item.level}
                      barClass={cat.barClass}
                      inView={inView}
                      delay={ci * 100 + ii * 60}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tools row */}
          <div className="mt-8 border border-border/40 rounded-xl p-6 bg-surface/30">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
              daily driver tools
            </p>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map(t => (
                <span key={t} className="tag border-border/40 text-text-dim bg-bg/40">{t}</span>
              ))}
            </div>
          </div>

          {/* Currently learning */}
          <div className="mt-4 border border-purple-400/20 rounded-xl p-5 bg-purple-400/5">
            <p className="font-mono text-xs text-purple-400 uppercase tracking-widest mb-2">currently leveling up</p>
            <div className="flex flex-wrap gap-2">
              {['Rust', 'WebAssembly', 'PCB design (KiCad)', 'llama.cpp fine-tuning', 'Kubernetes'].map(t => (
                <span key={t} className="tag border-purple-400/20 text-purple-300 bg-purple-400/5">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillBar({
  name, level, barClass, inView, delay,
}: {
  name: string;
  level: number;
  barClass: string;
  inView: boolean;
  delay: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-text-dim">{name}</span>
        <span className="font-mono text-xs text-muted">{level}%</span>
      </div>
      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barClass}`}
          style={{
            width: inView ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
