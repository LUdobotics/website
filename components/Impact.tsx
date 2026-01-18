import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Section } from './ui/Section';
import { METRICS } from '../constants';

export const Impact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <Section className="bg-ludo-deep relative border-y border-ludo-border/20">
      <div className="absolute inset-0 bg-ludo-blue/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">
            Measuring Impact
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-ludo-border/30">
          {METRICS.map((metric, idx) => (
             <div key={idx} className="pt-8 md:pt-0 md:px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="mb-2"
                >
                  <span className="font-orbitron text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-ludo-cyan via-ludo-blue to-ludo-magenta">
                    {metric.value}
                    <span className="text-3xl md:text-4xl ml-1">{metric.suffix}</span>
                  </span>
                </motion.div>
                <h3 className="font-grotesk font-bold text-xl text-white mb-3 uppercase tracking-wider">
                  {metric.label}
                </h3>
                <p className="font-grotesk text-ludo-muted text-sm max-w-xs mx-auto">
                  {metric.description}
                </p>
             </div>
          ))}
        </div>
      </div>
    </Section>
  );
};