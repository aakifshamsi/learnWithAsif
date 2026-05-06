import type { RefObject } from 'react';
import { useInView } from '../hooks/useInView';
import { SectionLabel } from './About';

const PILLARS = [
  {
    icon: '🌍',
    title: 'Free tools for everyone',
    body: 'I believe powerful software should be accessible. ElecAI will become a free public service for Indian elections. My home cloud experiments will be documented openly. The infrastructure knowledge stays free.',
  },
  {
    icon: '🔒',
    title: 'Privacy by architecture',
    body: 'Not as a checkbox — as a design constraint. SHA-256 for EPIC validation. Sandboxed iframes for ads. No PII logging. If your architecture can\'t leak private data, you don\'t need to promise not to.',
  },
  {
    icon: '⚡',
    title: 'Speed as a product feature',
    body: 'Every millisecond of latency is a product choice. I build on Cloudflare\'s edge because your user in Chennai deserves the same speed as your user in Toronto. Global edge is the only acceptable default.',
  },
  {
    icon: '🔩',
    title: 'Hardware + software convergence',
    body: 'The most interesting problems live at the boundary. Floating cameras. Holographic POV displays. Exoskeletons. AI on microcontrollers. The best software engineers will be the ones who understand the physical world.',
  },
];

const TIMELINE = [
  { year: '2024', event: 'Founded Digitalands — enterprise identity & SaaS hosting for IN + CA markets' },
  { year: '2025', event: 'Built ElecAI — live elections dashboard on Cloudflare edge with AI-generated narratives' },
  { year: '2025', event: 'Started Tuxedo home cloud project — sovereign AI infrastructure with local LLMs' },
  { year: '2025', event: 'Prototyping ESP32-CAM floating surveillance drones and holographic POV displays' },
  { year: '2026+', event: 'Launch sham.si as personal brand. Build exoskeleton prototype. Expand open-source tools.' },
];

export default function Vision() {
  const { ref, inView } = useInView();

  return (
    <section id="vision" ref={ref as RefObject<HTMLElement>} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel label="vision" />
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">
            What I'm{' '}
            <span className="text-gradient-amber">building toward</span>
          </h2>

          <blockquote className="border-l-2 border-accent-3 pl-5 py-2 mb-12 max-w-2xl">
            <p className="text-lg text-text-dim leading-relaxed italic">
              "I want to build the kind of tools that make you wonder why they didn't exist before —
              and then make them free, because they should be."
            </p>
            <footer className="mt-2 font-mono text-xs text-muted">— Aakif Shamsi</footer>
          </blockquote>

          {/* Pillars */}
          <div className="grid sm:grid-cols-2 gap-5 mb-16">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="border-glow rounded-xl p-6 bg-surface/40 backdrop-blur-sm"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-text mb-2">{p.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="border border-border/40 rounded-2xl p-8 bg-surface/30">
            <h3 className="font-mono text-sm text-muted uppercase tracking-widest mb-8">journey so far</h3>
            <div className="relative">
              <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-border/60" />
              <div className="space-y-6">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <span className="font-mono text-xs text-accent w-14 flex-shrink-0 pt-0.5 text-right">{t.year}</span>
                    <div className="relative">
                      <div className="absolute -left-[1.65rem] top-1.5 w-2 h-2 rounded-full border border-accent/40 bg-bg" />
                    </div>
                    <p className="text-text-dim text-sm leading-relaxed pl-1">{t.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Open to */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🤝', title: 'Collaboration', body: 'Open source projects, especially in civic tech, infrastructure, or hardware.' },
              { icon: '💼', title: 'Consulting', body: 'Cloudflare architecture, edge computing, AI integration, full-stack TypeScript.' },
              { icon: '🚀', title: 'Sponsorships', body: 'Support open tools like ElecAI so I can keep them free and well-maintained.' },
            ].map(o => (
              <div key={o.title} className="border border-border/30 rounded-xl p-5 bg-bg/40 text-center">
                <div className="text-2xl mb-2">{o.icon}</div>
                <h4 className="font-semibold text-text mb-1">{o.title}</h4>
                <p className="text-xs text-text-dim">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
