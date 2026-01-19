import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Microscope, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Section } from './ui/Section';
import solutionImage from '../assets/solutions_image.png';

const values = [
  { icon: Gamepad2, text: "Learn ROS 2 by doing, inside the Virtual World" },
  { icon: Microscope, text: "High-fidelity robotics simulation matching real ROS 2 behavior" },
  { icon: Lightbulb, text: "Instant feedback, hints, and debugging support" },
  { icon: TrendingUp, text: "Seamless progression from basics to advanced robotics tasks" },
];

export const Solution: React.FC = () => {
  return (
    <Section id="solution" className="bg-ludo-deep relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-ludo-green/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual Side */}
          <div className="order-2 lg:order-1 relative">
            <div className="relative z-10 bg-ludo-panel border border-ludo-green/30 rounded-2xl p-2 md:p-4 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
              <img
                src={solutionImage}
                alt="Ludobotics Simulation Interface"
                className="rounded-lg w-full h-auto opacity-90"
              />

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-ludo-deep border border-ludo-green p-4 rounded-lg shadow-xl flex items-center gap-3">
                <CheckCircle2 className="text-ludo-green" size={32} />
                <div>
                  <div className="font-mono text-xs text-ludo-muted uppercase">Status</div>
                  <div className="font-orbitron font-bold text-white">Mission Complete</div>
                </div>
              </div>
            </div>

            {/* Decorative Grid Behind */}
            <div className="absolute -inset-4 border-2 border-dashed border-ludo-green/20 rounded-3xl z-0" />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <span className="font-mono text-ludo-green uppercase tracking-widest text-sm mb-4 block">
              Our Solution
            </span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-white mb-6">
              Game-Based <br />
              <span className="text-ludo-green">ROS 2 Mastery</span>
            </h2>

            <p className="font-grotesk text-lg text-ludo-muted mb-10 leading-relaxed">
              Ludobotics introduces an intelligent learning layer that turns ROS 2 concepts into interactive missions, story-driven exploration, and real robot challenges — bridging the gap between theory and application.
            </p>

            <div className="space-y-6">
              {values.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-ludo-green/10 flex items-center justify-center shrink-0 mt-1">
                    <item.icon className="text-ludo-green" size={20} />
                  </div>
                  <p className="font-grotesk text-white/90 text-lg">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
};