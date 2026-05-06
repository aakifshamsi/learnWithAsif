import { useState } from 'react';

const NODES = [
  {
    sub: 'aakif',
    label: 'aakif.sham.si',
    href: 'https://aakifshamsi.github.io/learnWithAsif/',
    desc: 'Personal profile · Builder & Cloud Architect',
    status: 'live',
    icon: '👤',
    color: '#00d4ff',
  },
  {
    sub: 'elecai',
    label: 'ElecAI',
    href: 'https://github.com/aakifshamsi/learnWithAsif',
    desc: 'India Elections live dashboard · free public service · sham.si ecosystem',
    status: 'live',
    icon: '🗳️',
    color: '#10b981',
  },
  {
    sub: 'lab',
    label: 'lab.sham.si',
    href: null,
    desc: 'Open experiments · ESP32, AI, hardware hacks',
    status: 'soon',
    icon: '🔬',
    color: '#7c3aed',
  },
  {
    sub: 'tools',
    label: 'tools.sham.si',
    href: null,
    desc: 'Free utilities · link shortener, converters, more',
    status: 'soon',
    icon: '🛠️',
    color: '#f59e0b',
  },
  {
    sub: 'jarvis',
    label: 'jarvis.sham.si',
    href: null,
    desc: 'Local AI assistant · voice, memory, context engine',
    status: 'building',
    icon: '🤖',
    color: '#10b981',
  },
];

export default function App() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans px-4 py-16">
      {/* Deep space background */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 10%, rgba(0,212,255,0.06) 0%, transparent 55%)',
          position: 'absolute', inset: 0,
        }} />
        <div style={{
          background: 'radial-gradient(ellipse 80% 60% at 80% 80%, rgba(124,58,237,0.04) 0%, transparent 50%)',
          position: 'absolute', inset: 0,
        }} />
        <Stars />
      </div>

      {/* Wordmark */}
      <div className="relative z-10 text-center mb-16 slide-in">
        <div className="font-mono text-7xl md:text-9xl font-black tracking-tighter select-none mb-2">
          <span className="text-gradient">sham</span>
          <span className="text-dim opacity-40">.</span>
          <span className="text-gradient">si</span>
        </div>
        <p className="font-mono text-dim text-sm tracking-widest uppercase">
          The Shamsi network
          <span className="blink text-accent ml-1">_</span>
        </p>
      </div>

      {/* Node grid */}
      <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl slide-in-2">
        {NODES.map((node, i) => (
          <NodeCard
            key={node.sub}
            node={node}
            delay={i * 80}
            hovered={hovered === node.sub}
            onHover={setHovered}
          />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 mt-16 slide-in-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-6 text-xs font-mono text-dim">
          <a href="https://github.com/aakifshamsi" target="_blank" rel="noopener noreferrer"
            className="hover:text-accent transition-colors">github ↗</a>
          <span className="w-px h-3 bg-dim/30" />
          <a href="https://digitalands.in" target="_blank" rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors">digitalands.in ↗</a>
          <span className="w-px h-3 bg-dim/30" />
          <span className="text-dim/50">New Westminster, BC</span>
        </div>
        <p className="text-xs text-dim/40 font-mono">
          built on Cloudflare · <span className="text-accent/50">always free</span>
        </p>
      </div>
    </div>
  );
}

type Node = typeof NODES[0];

function NodeCard({ node, delay, hovered, onHover }: {
  node: Node;
  delay: number;
  hovered: boolean;
  onHover: (s: string | null) => void;
}) {
  const isLive = node.status === 'live';
  const isBuilding = node.status === 'building';

  const Wrapper = isLive ? 'a' : 'div';
  const wrapperProps = isLive
    ? { href: node.href!, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as object)}
      className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
        isLive ? 'cursor-pointer' : 'cursor-default'
      }`}
      style={{
        borderColor: hovered && isLive
          ? `${node.color}55`
          : 'rgba(255,255,255,0.06)',
        background: hovered && isLive
          ? `${node.color}08`
          : 'rgba(255,255,255,0.02)',
        boxShadow: hovered && isLive
          ? `0 0 30px ${node.color}15`
          : 'none',
        animationDelay: `${delay + 300}ms`,
      }}
      onMouseEnter={() => onHover(node.sub)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl float">{node.icon}</span>
        <StatusDot status={node.status} color={node.color} />
      </div>

      <div className="font-mono text-sm font-bold mb-1" style={{ color: node.color }}>
        {node.label}
      </div>
      <p className="text-xs text-dim leading-relaxed">{node.desc}</p>

      {isLive && (
        <div className="mt-3 flex items-center gap-1 font-mono text-xs"
          style={{ color: node.color }}>
          <span>visit</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      {!isLive && (
        <div className="mt-3 font-mono text-xs text-dim/50">
          {isBuilding ? '⚙ in development' : '◌ coming soon'}
        </div>
      )}
    </Wrapper>
  );
}

function StatusDot({ status, color }: { status: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{
        background: status === 'live' ? '#10b981' : status === 'building' ? color : '#475569',
        ...(status === 'live' ? {
          boxShadow: '0 0 6px #10b981',
          animation: 'pulse 2s ease-in-out infinite',
        } : {}),
      }} />
      <span className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: status === 'live' ? '#10b981' : '#475569' }}>
        {status}
      </span>
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.2 + 0.3,
    op: Math.random() * 0.4 + 0.1,
    key: i,
  }));

  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {stars.map(s => (
        <circle key={s.key} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op} />
      ))}
    </svg>
  );
}
