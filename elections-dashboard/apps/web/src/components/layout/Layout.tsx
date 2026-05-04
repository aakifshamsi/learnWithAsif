import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface Props { children: ReactNode }

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
