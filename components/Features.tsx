import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { FEATURES } from '../constants';

export const Features: React.FC = () => {
  return (
    <Section id="features" className="bg-ludo-deep">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-ludo-cyan uppercase tracking-widest text-sm mb-4 block">System Capabilities</span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">
            Built for <span className="text-ludo-cyan">Immersion</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-ludo-panel border border-ludo-border/30 p-8 rounded-2xl hover:border-ludo-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-ludo-cyan/20 to-ludo-blue/20 rounded-xl flex items-center justify-center border border-ludo-cyan/30 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-ludo-cyan" size={24} />
                </div>
                <span className="font-mono text-xs text-ludo-muted opacity-50">0{idx + 1}</span>
              </div>
              
              <h3 className="font-orbitron text-xl font-bold text-white mb-3 group-hover:text-ludo-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="font-grotesk text-ludo-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};