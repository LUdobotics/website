import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ExternalLink } from 'lucide-react';
import { Section } from './ui/Section';

const supporters = [
  {
    name: 'Luxembourg National Research Fund (FNR)',
    website: 'https://www.fnr.lu/',
    logo: 'https://www.fnr.lu/wp-content/uploads/2023/07/FNR_LOGO.png',
    className: 'max-h-14 max-w-[132px]',
    surfaceClassName: 'border-white bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]',
    iconClassName: 'text-ludo-deep/35 group-hover:text-ludo-blue',
  },
  {
    name: 'Luxembourg Space Agency (LSA)',
    website: 'https://space-agency.public.lu/en.html',
    logo: 'https://space-agency.public.lu/dam-assets/logos/logo-lsa-white.svg',
    className: 'max-h-14 max-w-[148px]',
    surfaceClassName: 'border-white/20 bg-[#132437] shadow-[0_12px_32px_rgba(0,0,0,0.14)]',
    iconClassName: 'text-white/35 group-hover:text-white',
  },
  {
    name: 'University of Luxembourg',
    website: 'https://www.uni.lu/',
    logo: 'https://www.uni.lu/wp-content/uploads/sites/9/2026/03/01193429/universite-du-luxembourg-logo.svg',
    className: 'max-h-14 max-w-[162px]',
    surfaceClassName: 'border-white bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]',
    iconClassName: 'text-ludo-deep/35 group-hover:text-ludo-blue',
  },
  {
    name: 'SnT, University of Luxembourg',
    website: 'https://snt.uni.lu/',
    logo: 'https://www.uni.lu/wp-content/uploads/sites/5/2026/03/01195157/interdisciplinary-centre-for-security-reliability-and-trust.svg',
    className: 'max-h-14 max-w-[158px]',
    surfaceClassName: 'border-white bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]',
    iconClassName: 'text-ludo-deep/35 group-hover:text-ludo-blue',
  },
];

const carouselSupporters = [...supporters, ...supporters];

export const Supporters: React.FC = () => (
  <Section className="relative overflow-hidden border-y border-ludo-border/20 bg-[#071324]">
    <style>{`
      @keyframes supporters-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .supporters-marquee {
        animation: supporters-marquee 30s linear infinite;
      }
      .supporters-marquee:hover {
        animation-play-state: paused;
      }
      @media (prefers-reduced-motion: reduce) {
        .supporters-marquee { animation-play-state: paused; }
      }
    `}</style>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,255,255,0.12),transparent_52%)]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ludo-cyan/60 to-transparent" />

    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ludo-cyan">
          <HeartHandshake size={15} /> They support us
        </div>
        <h2 className="font-orbitron text-3xl font-bold text-white md:text-5xl">
          Made possible by <span className="bg-gradient-to-r from-ludo-cyan to-ludo-blue bg-clip-text text-transparent">our supporters.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl font-grotesk text-base leading-relaxed text-white/60">
          The Odyssey is proud to be supported by Luxembourg’s research, education and space communities.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="relative mx-auto mt-12 max-w-6xl"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#071324] via-[#071324]/80 to-transparent sm:w-44" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#071324] via-[#071324]/80 to-transparent sm:w-44" />
        <div className="overflow-hidden py-2">
          <div className="supporters-marquee flex w-max gap-5 pr-5">
            {carouselSupporters.map((supporter, index) => {
              const isDuplicate = index >= supporters.length;

              return (
          <a
            key={`${supporter.name}-${index}`}
            href={supporter.website}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${supporter.name}`}
            aria-hidden={isDuplicate || undefined}
            tabIndex={isDuplicate ? -1 : undefined}
            className={`group relative flex h-32 w-56 shrink-0 items-center justify-center overflow-hidden rounded-2xl border px-7 py-8 transition duration-300 hover:-translate-y-1 hover:border-ludo-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-ludo-cyan sm:w-64 ${supporter.surfaceClassName}`}
          >
            <span className={`absolute right-4 top-4 transition ${supporter.iconClassName}`}><ExternalLink size={14} /></span>
            <img
              src={supporter.logo}
              alt={`${supporter.name} logo`}
              className={`h-auto w-auto object-contain transition duration-300 group-hover:scale-105 ${supporter.className}`}
            />
          </a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  </Section>
);
