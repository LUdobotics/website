import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Features } from './components/Features';
import { Impact } from './components/Impact';
import { Roadmap } from './components/Roadmap';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { BetaModal } from './components/BetaModal';
import { TRDPage } from './components/TRDPage';

function App() {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'trd'>('landing');

  const openBeta = () => setIsBetaModalOpen(true);
  const closeBeta = () => setIsBetaModalOpen(false);

  if (view === 'trd') {
    return <TRDPage onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-ludo-deep text-white selection:bg-ludo-cyan selection:text-ludo-deep">
      <Navbar onOpenBeta={openBeta} />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Impact />
        <Roadmap />
        <CTA onOpenBeta={openBeta} />
      </main>
      <Footer onOpenTRD={() => setView('trd')} />
      <BetaModal isOpen={isBetaModalOpen} onClose={closeBeta} />
    </div>
  );
}

export default App;