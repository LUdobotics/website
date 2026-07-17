import React from 'react';
import { motion } from 'framer-motion';
import { Braces, BriefcaseBusiness, Cpu, Rocket, UserRound, Users } from 'lucide-react';
import { Section } from './ui/Section';

const team = [
  {
    name: 'Dr. Loïck Chovet',
    role: 'CEO/CTO and Founder of Ludobotics',
    initials: 'LC',
    icon: Rocket,
    accent: 'from-ludo-cyan/30 via-ludo-blue/15 to-transparent',
  },
  {
    name: 'Rishekesh Ramesh',
    role: 'COO and Founder',
    initials: 'RR',
    icon: BriefcaseBusiness,
    accent: 'from-ludo-blue/35 via-ludo-magenta/10 to-transparent',
  },
  {
    name: 'Prof. Dr. Miguel Olivares Mendez',
    role: 'Founder',
    initials: 'MM',
    icon: Users,
    accent: 'from-ludo-magenta/25 via-ludo-blue/15 to-transparent',
  },
  {
    name: 'Dr. Dave van der Meer',
    role: 'ROS2 technical expert',
    initials: 'DM',
    icon: Braces,
    accent: 'from-ludo-green/25 via-ludo-cyan/10 to-transparent',
  },
];

export const Team: React.FC = () => (
  <Section id="team" className="relative overflow-hidden bg-ludo-deep">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.12),transparent_48%)]" />
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(0,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,.08)_1px,transparent_1px)] [background-size:54px_54px]" />

    <div className="container relative z-10 mx-auto px-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-ludo-cyan">
          <Cpu size={15} /> The people behind the Odyssey
        </div>
        <h2 className="font-orbitron text-3xl font-bold text-white md:text-5xl">
          Built by roboticists. <span className="bg-gradient-to-r from-ludo-cyan to-ludo-blue bg-clip-text text-transparent">Driven by educators.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl font-grotesk text-lg leading-relaxed text-white/60">
          A multidisciplinary founding team bringing together robotics, product leadership and hands-on ROS 2 expertise.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {team.map((member, index) => (
          <motion.article
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ delay: index * 0.08 }}
            className="group overflow-hidden rounded-2xl border border-ludo-border/35 bg-ludo-panel transition duration-300 hover:-translate-y-1 hover:border-ludo-cyan/50 hover:shadow-[0_18px_55px_rgba(0,102,255,0.14)]"
          >
            <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${member.accent}`}>
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div role="img" aria-label={`Placeholder portrait for `} className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-ludo-deep/75 shadow-[0_0_45px_rgba(0,255,255,0.12)] backdrop-blur-sm">
                <UserRound size={42} className="absolute text-white/15" />
                <span className="mt-16 font-mono text-xs font-bold tracking-[0.2em] text-ludo-cyan">{member.initials}</span>
              </div>
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-ludo-deep/60 text-white/45 backdrop-blur-sm transition group-hover:border-ludo-cyan/30 group-hover:text-ludo-cyan">
                <member.icon size={17} />
              </span>
              <span className="absolute bottom-3 left-4 font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">Portrait coming soon</span>
            </div>
            <div className="min-h-36 p-5">
              <h3 className="font-orbitron text-base font-bold leading-snug text-white">{member.name}</h3>
              <p className="mt-3 font-grotesk text-sm leading-relaxed text-ludo-cyan/75">{member.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </Section>
);
