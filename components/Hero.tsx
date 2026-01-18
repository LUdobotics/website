import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Section } from './ui/Section';
import { VideoModal } from './ui/VideoModal';
import heroImage from '../assets/hero_image.png';

export const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <Section className="min-h-screen flex items-center relative" noPadding>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0 bg-[length:50px_50px]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ludo-cyan/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ludo-magenta/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-ludo-cyan/30 rounded-full bg-ludo-cyan/5 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-ludo-green animate-pulse" />
              <span className="font-mono text-xs text-ludo-cyan tracking-widest uppercase">
                Game. Learn. Deploy.
              </span>
            </motion.div>

            <h1 className="font-orbitron text-5xl md:text-7xl font-black leading-tight mb-6">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-ludo-cyan to-ludo-blue">ROS2</span> like never before
            </h1>

            <p className="font-grotesk text-lg md:text-xl text-ludo-muted mb-4 max-w-xl">
              An immersive, game-based learning platform that transforms how ROS2 is learnt, through exploration, problem-solving, and real scenarios.
            </p>

            <p className="font-grotesk text-base text-white/80 mb-10 max-w-lg border-l-2 border-ludo-orange pl-4 italic">
              Our first title — <span className="text-white font-bold">The Odyssey</span> — turns ROS2 learning into an interactive space adventure powered by real robotics workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button icon={<PlayCircle size={20} />} onClick={() => setIsVideoOpen(true)}>
                Watch Trailer
              </Button>
              <Button variant="secondary" icon={<ChevronRight size={20} />}>
                Sneak Peek
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-ludo-border bg-ludo-panel/50 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,255,0.1)] group">
              {/* Mockup Image Placeholder */}
              <img
                src={heroImage}
                alt="The Odyssey Gameplay"
                className="w-full h-full object-cover transition-all duration-700"
              />

              {/* Overlay UI Mockup Elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between font-mono text-xs text-ludo-cyan">
                <span>SYS.ONLINE</span>
                <span>ROS2: ACTIVE</span>
              </div>


            </div>

            {/* Floating Decorative Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-24 h-24 border border-ludo-magenta/30 bg-ludo-deep/80 backdrop-blur rounded-lg flex items-center justify-center"
            >
              <span className="font-orbitron font-bold text-2xl text-ludo-magenta">ROS2</span>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://drive.google.com/file/d/1Du9RhQXgU3nc-LIXLEoZRvKDWP5A4j4j/preview"
      />
    </Section >
  );
};