import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Section } from './ui/Section';
import { PROBLEMS } from '../constants';

export const Problem: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Section id="problem" className="bg-ludo-deep relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ludo-orange/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-ludo-orange uppercase tracking-widest text-sm mb-4 block">Current State</span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-6">
            The Problem with <br />
            <span className="text-ludo-orange">Traditional Learning</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEMS.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-ludo-panel border border-ludo-border/50 p-8 rounded-xl hover:border-ludo-orange/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-ludo-orange opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 bg-ludo-orange/10 rounded-lg flex items-center justify-center mb-6 text-ludo-orange border border-ludo-orange/20 group-hover:scale-110 transition-transform">
                <problem.icon size={28} />
              </div>
              
              <h3 className="font-orbitron text-xl font-bold mb-4 text-white group-hover:text-ludo-orange transition-colors">
                {problem.title}
              </h3>
              
              <p className="font-grotesk text-ludo-muted leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};