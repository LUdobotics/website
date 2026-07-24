import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, CheckCircle2, Download, FileCode2, Terminal } from 'lucide-react';
import { Section } from './ui/Section';

const downloadUrl = 'https://dl.patchkit.net/d/21plmqaazwhzt3484oibu/direct';

const steps = [
  {
    icon: Download,
    title: 'Download the launcher',
    description: 'Save the AppImage somewhere easy to find, such as your Downloads folder.',
  },
  {
    icon: CheckCircle2,
    title: 'Allow it to run',
    description: 'Right-click the file, open Properties, then enable the executable permission if your desktop asks for it.',
  },
  {
    icon: Terminal,
    title: 'Start the launcher',
    description: 'Double-click the AppImage, or launch it from a terminal after making it executable.',
  },
];

export const LauncherDownloadStudent: React.FC = () => {
  return (
    <div className="min-h-screen bg-ludo-deep text-white selection:bg-ludo-cyan selection:text-ludo-deep">
      <Section className="min-h-screen flex items-center relative" noPadding>
        <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0 bg-[length:50px_50px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ludo-cyan/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ludo-magenta/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <a
              href="/account/manage"
              className="mb-10 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-ludo-panel/70 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/55 transition-colors hover:border-ludo-cyan/35 hover:text-ludo-cyan"
            >
              <ArrowLeft size={14} />
              Account management
            </a>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-ludo-cyan/30 rounded-full bg-ludo-cyan/5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-ludo-green animate-pulse" />
                <span className="font-mono text-xs text-ludo-cyan tracking-widest uppercase">
                  Welcome aboard
                </span>
              </div>

              <h1 className="font-orbitron text-4xl md:text-6xl font-black leading-tight mb-6">
                Thank you for <span className="text-transparent bg-clip-text bg-gradient-to-r from-ludo-cyan to-ludo-blue">joining us</span>
              </h1>

              <p className="font-grotesk text-lg md:text-xl text-ludo-muted max-w-2xl mx-auto mb-10">
                Your next step is to download the Ludobotics launcher and use it to access your student build.
              </p>

              <motion.a
                href={downloadUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center justify-center gap-3 px-8 py-4 font-orbitron text-sm font-bold tracking-widest uppercase transition-all duration-300 clip-path-slant bg-ludo-cyan text-ludo-deep hover:bg-white hover:shadow-[0_0_28px_rgba(0,255,255,0.55)] border border-transparent"
              >
                Download launcher
                <Download size={20} />
              </motion.a>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.1, duration: 0.55 }}
                  className="bg-ludo-panel border border-ludo-border/40 rounded-xl p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ludo-cyan/40 bg-ludo-cyan/10 font-orbitron text-2xl font-black text-ludo-cyan">
                      {index + 1}
                    </span>
                    <div className="w-12 h-12 bg-gradient-to-br from-ludo-cyan/20 to-ludo-blue/20 rounded-xl flex items-center justify-center border border-ludo-cyan/30">
                      <step.icon className="text-ludo-cyan" size={24} />
                    </div>
                  </div>
                  <h2 className="font-orbitron text-lg font-bold text-white mb-3">
                    {step.title}
                  </h2>
                  <p className="font-grotesk text-ludo-muted leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              className="bg-ludo-panel border border-ludo-green/30 rounded-xl p-6 md:p-8"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <FileCode2 className="text-ludo-green" size={24} />
                    <h2 className="font-orbitron text-xl font-bold text-white">
                      Running an AppImage on Linux
                    </h2>
                  </div>
                  <p className="font-grotesk text-ludo-muted leading-relaxed mb-5">
                    If double-clicking does not start the launcher, make the file executable first. From a terminal in the download folder, run:
                  </p>
                  <div className="bg-ludo-deep/70 border border-ludo-border/30 rounded-lg px-4 py-3 font-mono text-sm text-ludo-cyan overflow-x-auto">
                    chmod +x ./Launcher.AppImage
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-ludo-orange" size={24} />
                    <h2 className="font-orbitron text-xl font-bold text-white">
                      Common fixes
                    </h2>
                  </div>
                  <ul className="font-grotesk text-ludo-muted leading-relaxed space-y-3">
                    <li className="border-l-2 border-ludo-orange pl-4">
                      If your browser renamed the file, keep the <span className="text-white">.AppImage</span> extension.
                    </li>
                    <li className="border-l-2 border-ludo-orange pl-4">
                      If your file manager blocks execution, use the terminal command shown alongside these tips and launch it again.
                    </li>
                    <li className="border-l-2 border-ludo-orange pl-4">
                      If Linux asks whether to trust the file, allow execution for this AppImage.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
};
