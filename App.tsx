import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { TeacherBenefits } from './components/TeacherBenefits';
import { Features } from './components/Features';
import { Impact } from './components/Impact';
import { Team } from './components/Team';
import { Roadmap } from './components/Roadmap';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { BetaModal } from './components/BetaModal';
import { CarouselModal } from './components/CarouselModal';
import { TRDPage } from './components/TRDPage';
import { LauncherDownloadStudent } from './components/LauncherDownloadStudent';
import { AccountPage, isAccountPath, isOrganizationPath } from './components/AccountPage';

interface AppProps {
  isClerkConfigured: boolean;
}

function App({ isClerkConfigured }: AppProps) {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isSneakPeekOpen, setIsSneakPeekOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'trd'>('landing');
  const path = window.location.pathname.replace(/\/$/, '');

  const openBeta = () => setIsBetaModalOpen(true);
  const closeBeta = () => setIsBetaModalOpen(false);

  const openSneakPeek = () => setIsSneakPeekOpen(true);
  const closeSneakPeek = () => setIsSneakPeekOpen(false);

  if (path === '/launcher_download_student' || path === '/launcher_download_client') {
    return <LauncherDownloadStudent isClerkConfigured={isClerkConfigured} />;
  }

  if (isAccountPath(path) || isOrganizationPath(path)) {
    return <AccountPage path={path} isClerkConfigured={isClerkConfigured} />;
  }

  if (view === 'trd') {
    return <TRDPage onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-ludo-deep text-white selection:bg-ludo-cyan selection:text-ludo-deep">
      <Navbar onOpenBeta={openBeta} onOpenSneakPeek={openSneakPeek} />
      <main>
        <Hero onOpenBeta={openBeta} onOpenSneakPeek={openSneakPeek} />
        <Problem />
        <Solution />
        <Features />
        <TeacherBenefits />
        <Impact />
        <Roadmap />
        <Team />
        <CTA onOpenBeta={openBeta} />
      </main>
      <Footer />
      <BetaModal isOpen={isBetaModalOpen} onClose={closeBeta} />
      <CarouselModal isOpen={isSneakPeekOpen} onClose={closeSneakPeek} />
    </div>
  );
}

export default App;
