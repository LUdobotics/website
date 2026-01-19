import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Phone } from 'lucide-react';
import { Section } from './ui/Section';
import { Button } from './ui/Button';

interface CTAProps {
  onOpenBeta: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenBeta }) => {
  return (
    <Section id="cta" className="bg-ludo-deep relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-ludo-blue/20 to-ludo-magenta/10" />
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-ludo-cyan/5 to-transparent" />

      {/* Particles (CSS Simulated) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-pulse" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-orbitron text-4xl md:text-6xl font-black text-white mb-6">
            Ready to Learn ROS 2 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ludo-cyan to-ludo-blue">
              The Fun Way?
            </span>
          </h2>

          <p className="font-grotesk text-xl text-ludo-muted max-w-2xl mx-auto mb-12">
            Enter <span className="text-white font-bold">The Odyssey</span> and start building real robotics skills inside an unforgettable space adventure.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Button
              onClick={onOpenBeta}
              className="w-full sm:w-auto text-lg py-4 px-10 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
            >
              <span className="mr-2">Join Beta Program</span>
              <Rocket size={20} />
            </Button>

            <a href="mailto:ludobotics@gmail.com" className="group flex items-center gap-2 text-ludo-muted hover:text-white transition-colors font-orbitron text-sm tracking-wider uppercase">
              <Phone size={16} className="group-hover:text-ludo-cyan transition-colors" />
              Queries
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};