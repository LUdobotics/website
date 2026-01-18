import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { ROADMAP } from '../constants';

export const Roadmap: React.FC = () => {
  return (
    <Section id="roadmap" className="bg-ludo-deep">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="font-mono text-ludo-magenta uppercase tracking-widest text-sm mb-4 block">Future Trajectory</span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">
            Journey to Launch
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ludo-cyan via-ludo-magenta to-ludo-deep md:-translate-x-1/2" />

          <div className="space-y-12">
            {ROADMAP.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <div className={`p-6 bg-ludo-panel border border-ludo-border/40 rounded-xl relative hover:border-ludo-magenta/50 transition-colors ${
                       isEven ? 'md:text-right' : 'md:text-left'
                    }`}>
                      <span className="font-mono text-xs text-ludo-magenta mb-2 block tracking-widest">
                        {item.date}
                      </span>
                      <h3 className="font-orbitron text-lg font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="font-grotesk text-ludo-muted text-sm">
                        {item.description}
                      </p>

                      {/* Connector Arrow (Desktop only visual tweak could go here) */}
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-[11px] md:left-1/2 top-6 md:top-1/2 w-[18px] h-[18px] bg-ludo-deep border-4 border-ludo-magenta rounded-full z-10 md:-translate-x-1/2 md:-translate-y-1/2 shadow-[0_0_10px_rgba(255,0,255,0.5)]" />

                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};