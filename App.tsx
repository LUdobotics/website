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
import { CarouselModal } from './components/CarouselModal';
import { TRDPage } from './components/TRDPage';

function App() {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isSneakPeekOpen, setIsSneakPeekOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'trd'>('landing');

  const openBeta = () => setIsBetaModalOpen(true);
  const closeBeta = () => setIsBetaModalOpen(false);

  const openSneakPeek = () => setIsSneakPeekOpen(true);
  const closeSneakPeek = () => setIsSneakPeekOpen(false);

  if (view === 'trd') {
    return <TRDPage onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-ludo-deep text-white selection:bg-ludo-cyan selection:text-ludo-deep">
      <Navbar onOpenBeta={openBeta} onOpenSneakPeek={openSneakPeek} />
      <main>
        <Hero onOpenBeta={openBeta} />
        <Problem />
        <Solution />
        <Features />
        <Impact />
        <Roadmap />
        <CTA onOpenBeta={openBeta} />
      </main>
      <Footer onOpenTRD={() => setView('trd')} />
      <BetaModal isOpen={isBetaModalOpen} onClose={closeBeta} />
      <CarouselModal isOpen={isSneakPeekOpen} onClose={closeSneakPeek} />
    </div>
  );
}

export default App;