import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import navLogo from '../assets/footer_logo.png';


interface NavbarProps {
  onOpenBeta: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBeta }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSneakPeekClick = () => {
    setMobileMenuOpen(false);
    // Placeholder for Sneak Peek action
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
        ? 'bg-ludo-deep/90 backdrop-blur-md border-ludo-border py-3'
        : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <img src={navLogo} alt="LUDOBOTICS" className="h-16 w-auto" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="font-grotesk text-sm font-medium text-ludo-muted hover:text-ludo-cyan transition-colors uppercase tracking-widest relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ludo-cyan transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button
            onClick={handleSneakPeekClick}
            className="px-6 py-2 border border-ludo-cyan text-ludo-cyan font-orbitron text-xs font-bold hover:bg-ludo-cyan hover:text-ludo-deep transition-all uppercase tracking-wider flex items-center gap-2"
          >
            Sneak Peek <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-ludo-deep z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="font-orbitron text-2xl text-white hover:text-ludo-cyan uppercase"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleSneakPeekClick}
              className="mt-8 px-8 py-3 bg-ludo-cyan text-ludo-deep font-bold font-orbitron uppercase flex items-center gap-2"
            >
              Sneak Peek <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};