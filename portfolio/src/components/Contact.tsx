import type { RefObject, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import { SectionLabel } from './About';

export default function Contact() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" ref={ref as RefObject<HTMLElement>} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel label="contact" />
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">
            Let's build something{' '}
            <span className="text-gradient-cyan">together</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 mt-12 items-start">
            {/* Left */}
            <div className="space-y-6">
              <p className="text-text-dim leading-relaxed text-lg">
                I'm always open to a good conversation — whether it's about a project idea,
                a consulting engagement, a sponsorship for open-source work, or just geeking
                out about Cloudflare internals or ESP32 circuits.
              </p>
              <p className="text-text-dim leading-relaxed">
                The fastest way to reach me is via GitHub or email. I'm based in New Westminster, BC
                (Pacific time) and try to respond within 24 hours.
              </p>

              <div className="space-y-3 pt-2">
                <ContactLink
                  icon={<GithubIcon />}
                  label="github.com/aakifshamsi"
                  href="https://github.com/aakifshamsi"
                  desc="code, issues, PRs"
                />
                <ContactLink
                  icon={<WebIcon />}
                  label="digitalands.in"
                  href="https://digitalands.in"
                  desc="business enquiries"
                />
                <ContactLink
                  icon={<GlobeIcon />}
                  label="aakif.sham.si"
                  href="https://aakif.sham.si"
                  desc="you are here"
                />
              </div>
            </div>

            {/* Right — quick-action cards */}
            <div className="space-y-4">
              {[
                {
                  emoji: '🤝',
                  title: 'Sponsor open tools',
                  body: 'Help keep ElecAI and future civic-tech projects free and actively maintained.',
                  cta: 'Discuss sponsorship →',
                  href: 'https://github.com/aakifshamsi',
                  border: 'border-amber-400/20 hover:border-amber-400/40',
                  tag: 'text-amber-400',
                },
                {
                  emoji: '⚡',
                  title: 'Hire for Cloudflare / edge work',
                  body: 'Workers, D1, Durable Objects, KV — or full-stack TypeScript product engineering.',
                  cta: 'View Digitalands →',
                  href: 'https://digitalands.in',
                  border: 'border-accent/20 hover:border-accent/40',
                  tag: 'text-accent',
                },
                {
                  emoji: '🔓',
                  title: 'Contribute or collaborate',
                  body: 'Open to co-building on civic tech, edge computing tools, or hardware hacks.',
                  cta: 'Open GitHub →',
                  href: 'https://github.com/aakifshamsi',
                  border: 'border-purple-400/20 hover:border-purple-400/40',
                  tag: 'text-purple-400',
                },
              ].map(card => (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block border rounded-xl p-5 bg-surface/40 backdrop-blur-sm transition-all duration-200 card-hover group ${card.border}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{card.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text mb-1">{card.title}</h4>
                      <p className="text-sm text-text-dim">{card.body}</p>
                      <span className={`inline-block mt-2 font-mono text-xs ${card.tag}`}>
                        {card.cta}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({ icon, label, href, desc }: { icon: ReactNode; label: string; href: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-surface/40 hover:border-accent/30 transition-all group"
    >
      <span className="text-muted group-hover:text-accent transition-colors">{icon}</span>
      <div>
        <span className="font-mono text-sm text-text group-hover:text-accent transition-colors">{label}</span>
        <p className="text-xs text-muted">{desc}</p>
      </div>
    </a>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function WebIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
