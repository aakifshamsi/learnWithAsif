import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const TERMINAL_LINES = [
  { delay: 0,    text: '$ whoami',                           type: 'cmd' },
  { delay: 600,  text: 'aakif shamsi',                        type: 'out' },
  { delay: 1000, text: '$ cat /etc/identity',                type: 'cmd' },
  { delay: 1600, text: 'Builder · Cloud Architect · AI Tinkerer', type: 'out' },
  { delay: 2200, text: '$ hostname',                          type: 'cmd' },
  { delay: 2800, text: 'New Westminster, BC, Canada',         type: 'out' },
  { delay: 3400, text: '$ ls ~/projects/',                   type: 'cmd' },
  { delay: 4000, text: 'elecai/   home-cloud/   sham.si/   esp32-eyes/', type: 'out' },
  { delay: 4600, text: '$ echo $MISSION',                    type: 'cmd' },
  { delay: 5200, text: 'Making tools that matter.',          type: 'out' },
];

const TAGLINES = [
  'Building the future from BC.',
  'Turning hardware into software.',
  'Running AI on the edge.',
  'Shipping products that scale.',
];

function TerminalLine({ text, type, visible }: { text: string; type: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className={`font-mono text-sm leading-relaxed ${type === 'cmd' ? 'text-accent' : 'text-text-dim'}`}>
      {type === 'out' && <span className="text-accent/30 mr-2">▸</span>}
      {text}
    </div>
  );
}

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const tagline = useTypewriter(TAGLINES, 55, 2200);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => new Set([...prev, i]));
      }, line.delay);
    });
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-16">
      {/* Orb glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem)]">

          {/* Left — headline */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-accent text-sm tracking-widest uppercase animate-fade-in">
                <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
                Full-Stack · Cloudflare · AI
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                <span className="block text-text">Aakif</span>
                <span className="block text-gradient-cyan">Shamsi</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-text-dim font-light leading-relaxed max-w-lg">
              I build{' '}
              <span className="text-accent font-medium">production-grade tools</span>
              {' '}at the intersection of cloud infrastructure, AI, and hardware.
            </p>

            <div className="h-8 flex items-center">
              <span className="text-lg text-text-dim font-mono">
                {tagline}
                <span className="cursor-blink text-accent ml-0.5">|</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20"
              >
                See my work
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border text-text-dim font-medium px-6 py-3 rounded-lg hover:border-accent/40 hover:text-text transition-all duration-200"
              >
                Get in touch
              </a>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <a href="https://github.com/aakifshamsi" target="_blank" rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors">
                <GithubIcon />
              </a>
              <a href="https://digitalands.in" target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs text-muted hover:text-accent-3 transition-colors">
                digitalands.in ↗
              </a>
            </div>
          </div>

          {/* Right — terminal */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both', opacity: 0 }}>
            <div className="border-glow rounded-xl bg-surface/80 backdrop-blur-sm overflow-hidden card-hover">
              {/* Terminal chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-bg/50">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 font-mono text-xs text-muted">aakif@sham.si:~</span>
              </div>
              {/* Terminal body */}
              <div className="p-5 space-y-1.5 min-h-[280px]">
                {TERMINAL_LINES.map((line, i) => (
                  <TerminalLine
                    key={i}
                    text={line.text}
                    type={line.type}
                    visible={visibleLines.has(i)}
                  />
                ))}
                {visibleLines.size === TERMINAL_LINES.length && (
                  <div className="font-mono text-sm text-accent mt-1">
                    $ <span className="cursor-blink">_</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { val: '543', label: 'Constituencies seeded', sub: 'ElecAI D1' },
                { val: '10k', label: 'MC simulations / tick', sub: 'Box-Muller' },
                { val: '∞', label: 'Ideas queued', sub: '~/projects' },
              ].map(s => (
                <div key={s.label} className="border border-border/40 rounded-lg p-3 text-center bg-surface/40">
                  <div className="text-2xl font-black text-accent font-mono">{s.val}</div>
                  <div className="text-xs text-text-dim mt-0.5">{s.label}</div>
                  <div className="text-xs text-muted font-mono">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted">
          <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}
