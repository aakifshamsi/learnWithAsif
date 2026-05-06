import type { RefObject } from 'react';
import { useInView } from '../hooks/useInView';
import { SectionLabel } from './About';

const PROJECTS = [
  {
    slug: 'elecai',
    name: 'ElecAI',
    tagline: 'India Elections Live Dashboard',
    status: 'live',
    statusColor: 'text-green-400 border-green-400/30 bg-green-400/5',
    description:
      'Real-time ECI constituency trends for all 543 Lok Sabha seats. Monte Carlo seat predictions (10k simulations per tick with Box-Muller Gaussian noise). Vote recording with EPIC # validation and SHA-256 privacy. Cloudflare Workers AI narrative generation. WebSocket-driven live updates via Durable Objects. Part of the sham.si open-tools ecosystem — free public service, sponsorship-supported.',
    tech: ['Cloudflare Workers', 'Hono.js', 'D1 SQLite', 'KV', 'R2', 'Durable Objects', 'CF Workers AI', 'React 18', 'Plotly.js', 'Vite'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aakifshamsi/learnWithAsif', icon: '⟨/⟩' },
      { label: 'sham.si ecosystem', href: 'https://sham.si', icon: '🌐' },
    ],
    highlight: true,
    icon: '🗳️',
    metrics: [
      { val: '543', label: 'constituencies' },
      { val: '10k', label: 'MC simulations' },
      { val: '<15s', label: 'KV cache TTL' },
    ],
  },
  {
    slug: 'home-cloud',
    name: 'Tuxedo Home Cloud',
    tagline: 'Personal sovereign AI infrastructure',
    status: 'building',
    statusColor: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
    description:
      'Converting a Tuxedo InfinityBook 16 (AMD Ryzen AI 9, 128 GB RAM) into a self-hosted cloud: KVM hypervisor with Ubuntu/Windows/macOS VMs, local LLM stack via Ollama, WireGuard VPN, Nextcloud, Gitea, reverse proxy to surface services at sham.si subdomains. Full sovereign stack, zero cloud rent.',
    tech: ['KVM/QEMU', 'libvirt', 'Ubuntu Server 24.04', 'Ollama', 'llama-3', 'WireGuard', 'Nginx', 'Nextcloud', 'Gitea', 'Docker'],
    links: [],
    highlight: false,
    icon: '🖥️',
    metrics: [
      { val: '128 GB', label: 'RAM' },
      { val: 'Ryzen AI 9', label: 'CPU' },
      { val: '∞', label: 'local LLMs' },
    ],
  },
  {
    slug: 'esp32-eyes',
    name: 'ESP32-CAM Drone Eyes',
    tagline: 'Floating wireless surveillance cameras',
    status: 'prototyping',
    statusColor: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
    description:
      'ESP32-CAM modules suspended on inflatable flotation collars to create wireless, buoyant surveillance nodes. MJPEG stream over WebSocket, OTA firmware updates, solar charging circuit. Designed for perimeter monitoring where fixed cameras are impractical.',
    tech: ['ESP32-CAM', 'Arduino C++', 'WebSocket', 'MJPEG', 'OTA', 'LiPo + solar', 'PCB design'],
    links: [],
    highlight: false,
    icon: '👁️',
    metrics: [
      { val: '30fps', label: 'MJPEG stream' },
      { val: 'OTA', label: 'firmware update' },
      { val: 'solar', label: 'power' },
    ],
  },
  {
    slug: 'digitalands',
    name: 'Digitalands',
    tagline: 'Enterprise identity & SaaS hosting',
    status: 'live',
    statusColor: 'text-green-400 border-green-400/30 bg-green-400/5',
    description:
      'Multi-tenant SaaS platform and hosting reseller serving businesses across India and Canada. Enterprise identity solutions, domain management, cloud provisioning, and managed services. Building the infrastructure layer so clients can focus on their core products.',
    tech: ['Node.js', 'TypeScript', 'Cloudflare', 'cPanel/WHM', 'WHMCS', 'MariaDB', 'Linux'],
    links: [
      { label: 'digitalands.in', href: 'https://digitalands.in', icon: '↗' },
    ],
    highlight: false,
    icon: '🏢',
    metrics: [
      { val: 'B2B', label: 'enterprise clients' },
      { val: 'IN + CA', label: 'markets' },
      { val: 'managed', label: 'cloud' },
    ],
  },
  {
    slug: 'holographic',
    name: 'Holographic Lighting Rig',
    tagline: 'Persistence-of-vision art installation',
    status: 'prototyping',
    statusColor: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
    description:
      'POV (persistence of vision) LED array driven by ESP32. Spinning at precise RPM creates floating 3D holograms visible to the naked eye. Custom firmware handles frame rendering, motor PID control, and Bluetooth configuration from a companion phone app.',
    tech: ['ESP32', 'WS2812B LEDs', 'PID control', 'Bluetooth LE', 'React Native', 'PCB design'],
    links: [],
    highlight: false,
    icon: '💡',
    metrics: [
      { val: 'POV', label: 'holographic' },
      { val: 'BLE', label: 'configured' },
      { val: '3D', label: 'mid-air display' },
    ],
  },
  {
    slug: 'shamsi-portfolio',
    name: 'aakif.sham.si',
    tagline: 'This very site',
    status: 'live',
    statusColor: 'text-green-400 border-green-400/30 bg-green-400/5',
    description:
      'A personal brand site built to tell a better story than a GitHub profile ever could. Deployed on Cloudflare Pages, zero backend, sub-100ms globally. Dark futuristic aesthetic, animated terminal hero, IntersectionObserver-driven scroll animations.',
    tech: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Cloudflare Pages', 'GitHub Actions'],
    links: [
      { label: 'Source', href: 'https://github.com/aakifshamsi/learnWithAsif', icon: '⟨/⟩' },
    ],
    highlight: false,
    icon: '🌐',
    metrics: [
      { val: '<100ms', label: 'TTFB global' },
      { val: '0', label: 'backend servers' },
      { val: 'CF Pages', label: 'hosting' },
    ],
  },
];

export default function Projects() {
  const { ref, inView } = useInView();

  return (
    <section id="projects" ref={ref as RefObject<HTMLElement>} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel label="projects" />
          <div className="mt-4 flex items-end justify-between">
            <h2 className="text-3xl md:text-4xl font-black mt-3">
              What I've{' '}
              <span className="text-gradient-cyan">shipped</span>
            </h2>
            <a
              href="https://github.com/aakifshamsi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted hover:text-accent transition-colors hidden sm:block"
            >
              github.com/aakifshamsi ↗
            </a>
          </div>

          {/* Featured project */}
          {PROJECTS.filter(p => p.highlight).map(p => (
            <FeaturedCard key={p.slug} project={p} />
          ))}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {PROJECTS.filter(p => !p.highlight).map((p, i) => (
              <ProjectCard key={p.slug} project={p} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Project = typeof PROJECTS[0];

function FeaturedCard({ project: p }: { project: Project }) {
  return (
    <div className="mt-8 border border-accent/20 rounded-2xl p-6 md:p-8 bg-surface/50 backdrop-blur-sm relative overflow-hidden card-hover"
      style={{ boxShadow: '0 0 60px rgba(0,212,255,0.06)' }}>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="relative z-10">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <span className="text-3xl">{p.icon}</span>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-black text-text">{p.name}</h3>
              <StatusBadge color={p.statusColor} status={p.status} />
              <span className="font-mono text-xs text-muted">FEATURED</span>
            </div>
            <p className="text-accent text-sm mt-0.5">{p.tagline}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <p className="text-text-dim leading-relaxed">{p.description}</p>
            <div className="flex flex-wrap gap-2">
              {p.tech.map(t => (
                <span key={t} className="tag border-accent/20 text-accent/70 bg-accent/5">{t}</span>
              ))}
            </div>
            {p.links.length > 0 && (
              <div className="flex gap-3 pt-1">
                {p.links.map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm border border-accent/30 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors font-mono">
                    <span>{l.icon}</span> {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-rows-3 gap-2">
            {p.metrics.map(m => (
              <div key={m.label} className="border border-border/40 rounded-lg p-3 text-center bg-bg/40">
                <div className="text-xl font-black text-accent font-mono">{m.val}</div>
                <div className="text-xs text-muted mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project: p, delay }: { project: Project; delay: number }) {
  return (
    <div
      className="border-glow rounded-xl p-5 bg-surface/40 backdrop-blur-sm flex flex-col card-hover"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{p.icon}</span>
        <StatusBadge color={p.statusColor} status={p.status} />
      </div>

      <h3 className="font-bold text-text text-lg leading-tight">{p.name}</h3>
      <p className="text-accent text-xs mt-0.5 mb-3">{p.tagline}</p>
      <p className="text-text-dim text-sm leading-relaxed flex-1">{p.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {p.tech.slice(0, 4).map(t => (
          <span key={t} className="tag border-border/40 text-muted bg-bg/40 text-[10px]">{t}</span>
        ))}
        {p.tech.length > 4 && (
          <span className="tag border-border/40 text-muted bg-bg/40 text-[10px]">+{p.tech.length - 4}</span>
        )}
      </div>

      {p.links.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
          {p.links.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="text-xs text-accent/70 hover:text-accent font-mono transition-colors">
              {l.icon} {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ color, status }: { color: string; status: string }) {
  return (
    <span className={`tag ${color} text-[10px] uppercase tracking-widest flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'live' ? 'bg-green-400 animate-pulse' :
        status === 'building' ? 'bg-amber-400' : 'bg-purple-400'
      }`} />
      {status}
    </span>
  );
}
