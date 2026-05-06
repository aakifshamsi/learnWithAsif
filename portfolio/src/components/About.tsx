import type { RefObject } from 'react';
import { useInView } from '../hooks/useInView';

const TRAITS = [
  {
    icon: '⚡',
    title: 'Builder by instinct',
    body: 'If I can imagine it, I build it. From a live election dashboard processing 543 Indian constituencies in real-time, to floating ESP32 surveillance drones, to a personal home cloud rivaling AWS—the gap between idea and shipped code is measured in days, not quarters.',
  },
  {
    icon: '🧠',
    title: 'AI-native mindset',
    body: 'I\'ve been running LLMs locally before it was cool: Ollama on a Ryzen AI 9 with 128 GB RAM, Cloudflare Workers AI for edge inference, whisper for transcription, llama-3 for narrative generation. AI is infrastructure to me, not a buzzword.',
  },
  {
    icon: '☁️',
    title: 'Cloud at the edges',
    body: 'Cloudflare is my home: Workers, D1, KV, R2, Durable Objects, AI—all wired together. I build on the global edge because latency is a product feature. Every millisecond I shave is a user experience improvement for someone in Mumbai, Lagos, or Vancouver.',
  },
  {
    icon: '🔩',
    title: 'Hardware roots',
    body: 'Software is just the beginning. I design ESP32 circuits, prototype exoskeleton mechanics, experiment with holographic lighting. When you understand the silicon, you write better software—and you build things nobody else has imagined.',
  },
];

export default function About() {
  const { ref, inView } = useInView();

  return (
    <section id="about" ref={ref as RefObject<HTMLElement>} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <SectionLabel label="about" />

          <div className="grid lg:grid-cols-2 gap-16 mt-12 items-start">
            {/* Left — bio */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                Not your average{' '}
                <span className="text-gradient-cyan">developer</span>.
              </h2>

              <div className="space-y-4 text-text-dim leading-relaxed">
                <p>
                  I'm <span className="text-text font-medium">Aakif Shamsi</span>, based in{' '}
                  <span className="text-text font-medium">New Westminster, BC</span>. I build software that runs
                  at scale — cloud-native architectures on Cloudflare's global network, AI-powered products,
                  and embedded hardware projects that push the boundary of what's possible.
                </p>
                <p>
                  By day, I architect multi-tenant SaaS platforms and enterprise identity solutions through{' '}
                  <a href="https://digitalands.in" target="_blank" rel="noopener noreferrer"
                    className="text-accent-3 hover:underline">digitalands.in</a>.
                  By night (and also day), I build personal projects that scratch itches — because the best
                  products are the ones you needed yourself.
                </p>
                <p>
                  I believe in <span className="text-text font-medium">shipping fast, shipping often, and making things free</span>{' '}
                  when they should be. Open infrastructure, open knowledge.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {['TypeScript', 'Python', 'Rust (learning)', 'Cloudflare', 'React', 'Hono.js', 'SQLite/D1', 'KVM/QEMU', 'ESP32/Arduino', 'Linux'].map(t => (
                  <span key={t} className="tag border-border/50 text-text-dim bg-surface/60">
                    {t}
                  </span>
                ))}
              </div>

              <div className="border-l-2 border-accent pl-4 py-1 mt-4">
                <p className="text-text-dim text-sm italic">
                  "The best infrastructure is the kind that disappears — it just works, globally, instantly."
                </p>
              </div>
            </div>

            {/* Right — traits */}
            <div className="grid gap-4">
              {TRAITS.map((t, i) => (
                <div
                  key={t.title}
                  className="border-glow rounded-xl p-5 bg-surface/40 backdrop-blur-sm"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5 flex-shrink-0">{t.icon}</span>
                    <div>
                      <h3 className="font-semibold text-text mb-1">{t.title}</h3>
                      <p className="text-sm text-text-dim leading-relaxed">{t.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-accent text-sm tracking-widest uppercase">
        <span className="text-accent/40">// </span>{label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
    </div>
  );
}
