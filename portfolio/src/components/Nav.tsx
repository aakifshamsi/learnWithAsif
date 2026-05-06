import { useEffect, useState } from 'react';

const links = [
  { href: '#about', label: 'about' },
  { href: '#projects', label: 'projects' },
  { href: '#stack', label: 'stack' },
  { href: '#vision', label: 'vision' },
  { href: '#contact', label: 'contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-border/60' : ''
    }`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-mono text-accent font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          aakif<span className="text-text-dim">.</span>sham<span className="text-text-dim">.</span>si
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-sm text-text-dim hover:text-accent transition-colors duration-200 relative group"
              >
                <span className="text-accent/50 mr-0.5">#</span>{l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-200 group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/aakifshamsi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs border border-accent/30 text-accent px-3 py-1.5 rounded hover:bg-accent/10 hover:border-accent/60 transition-all duration-200"
            >
              GitHub ↗
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-text-dim transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-text-dim transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-text-dim transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-border px-6 py-4">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-mono text-sm text-text-dim hover:text-accent py-2 transition-colors"
            >
              <span className="text-accent/50 mr-1">#</span>{l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
