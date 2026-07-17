import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, TrendingUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Section } from './ui/Section';
import { METRICS } from '../constants';

export const Impact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  return (
    <Section className="relative border-y border-ludo-border/20 bg-ludo-deep">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,102,255,0.14),transparent_55%)]" />

      <div ref={ref} className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ludo-cyan">
            <TrendingUp size={15} /> Learning outcomes
          </div>
          <h2 className="font-orbitron text-3xl font-bold text-white md:text-5xl">Impact you can measure</h2>
          <p className="mx-auto mt-5 max-w-2xl font-grotesk text-base leading-relaxed text-white/55">
            A learning experience designed to help more students succeed—and help the strongest engineers go further.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {METRICS.map((metric, index) => (
            <motion.article
              key={metric.label}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="rounded-2xl border border-ludo-border/30 bg-ludo-panel/90 p-7 text-center shadow-[0_16px_45px_rgba(0,0,0,0.12)]"
            >
              <div className="font-orbitron text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-ludo-cyan via-ludo-blue to-ludo-magenta md:text-6xl">
                {metric.value}
                {metric.suffix && <span className="ml-1 text-2xl md:text-3xl">{metric.suffix}</span>}
              </div>
              <h3 className="mt-4 font-grotesk text-base font-bold uppercase tracking-[0.1em] text-white">{metric.label}</h3>
              <p className="mx-auto mt-3 max-w-xs font-grotesk text-sm leading-relaxed text-ludo-muted">{metric.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.35 }}
          className="mt-8 overflow-hidden rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 shadow-[0_0_60px_rgba(0,255,255,0.07)]"
        >
          <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ludo-green">Knowledge score comparison</p>
              <h3 className="mt-2 font-orbitron text-lg font-bold text-white">Learning that sticks</h3>
            </div>
            <span className="font-grotesk text-xs text-white/40">Score out of 100</span>
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-[190px_1fr_60px] sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ludo-cyan/25 bg-ludo-cyan/10 text-ludo-cyan"><Gamepad2 size={17} /></span>
                <span className="font-grotesk text-sm font-bold text-white">The Odyssey</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-ludo-cyan/20 bg-white/[0.055]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: '72%' } : { width: 0 }}
                  transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-ludo-blue to-ludo-cyan shadow-[0_0_20px_rgba(0,255,255,0.35)]"
                />
              </div>
              <span className="font-orbitron text-xl font-black text-ludo-cyan sm:text-right">72%</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-[190px_1fr_60px] sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/45"><BookOpen size={17} /></span>
                <span className="font-grotesk text-sm font-bold text-white/70">Lecture benchmarks</span>
              </div>
              <div className="relative h-4 rounded-full border border-white/10 bg-white/[0.045]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: '20%' } : { width: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  className="absolute left-[20%] top-0 h-full rounded-full bg-gradient-to-r from-white/20 to-white/45"
                />
                <span className="absolute left-[20%] top-1/2 h-6 w-px -translate-y-1/2 bg-white/40" />
                <span className="absolute left-[40%] top-1/2 h-6 w-px -translate-y-1/2 bg-white/55" />
              </div>
              <span className="whitespace-nowrap font-orbitron text-base font-bold text-white/55 sm:text-right">20–40%</span>
            </div>

            <div className="hidden sm:grid sm:grid-cols-[190px_1fr_60px]">
              <span />
              <div className="flex justify-between font-mono text-[8px] text-white/25">
                {[0, 20, 40, 60, 80, 100].map(value => <span key={value}>{value}</span>)}
              </div>
              <span />
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
