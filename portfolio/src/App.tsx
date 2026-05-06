import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Stack from './components/Stack';
import Vision from './components/Vision';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans overflow-x-hidden">
      <div className="scan-line" />
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,255,0.07) 0%, transparent 60%)',
      }} />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Vision />
        <Contact />
      </main>
      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted">
        <span className="text-accent">aakif.sham.si</span>
        {' · '}built on Cloudflare
        {' · '}New Westminster, BC
        {' · '}
        <a href="https://github.com/aakifshamsi" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">github.com/aakifshamsi</a>
      </footer>
    </div>
  );
}
