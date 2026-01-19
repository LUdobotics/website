import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
import { Button } from './ui/Button';

interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BetaModal: React.FC<BetaModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission logic
    alert("Transmission Received. Welcome to the Beta Program.");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020810]/90 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <div className="bg-ludo-panel border border-ludo-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.15)] relative overflow-hidden backdrop-blur-xl">

                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ludo-cyan to-transparent opacity-50" />

                {/* Header */}
                <div className="p-8 pb-0 flex justify-between items-start relative z-10">
                  <div>
                    <div className="flex items-center gap-2 text-ludo-cyan mb-2">
                      <Terminal size={16} />
                      <span className="font-mono text-xs tracking-widest uppercase opacity-70">System Access</span>
                    </div>
                    <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white">
                      Join The <span className="text-ludo-cyan">Odyssey</span>
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-ludo-muted hover:text-ludo-cyan transition-colors p-2 hover:bg-ludo-cyan/10 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-ludo-cyan uppercase tracking-wider pl-1">First Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Pilot"
                        className="w-full bg-ludo-deep/60 border border-ludo-border rounded-lg px-4 py-3 text-white placeholder-ludo-muted/30 focus:border-ludo-cyan focus:ring-1 focus:ring-ludo-cyan focus:outline-none transition-all font-grotesk"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-ludo-cyan uppercase tracking-wider pl-1">Last Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Name"
                        className="w-full bg-ludo-deep/60 border border-ludo-border rounded-lg px-4 py-3 text-white placeholder-ludo-muted/30 focus:border-ludo-cyan focus:ring-1 focus:ring-ludo-cyan focus:outline-none transition-all font-grotesk"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-ludo-cyan uppercase tracking-wider pl-1">Email Coordinates</label>
                    <input
                      required
                      type="email"
                      placeholder="pilot@university.edu"
                      className="w-full bg-ludo-deep/60 border border-ludo-border rounded-lg px-4 py-3 text-white placeholder-ludo-muted/30 focus:border-ludo-cyan focus:ring-1 focus:ring-ludo-cyan focus:outline-none transition-all font-grotesk"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between pl-1">
                      <label className="font-mono text-xs text-ludo-cyan uppercase tracking-wider">Comms Link (Mobile)</label>
                      <span className="font-mono text-xs text-ludo-muted italic lowercase">optional</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-ludo-deep/60 border border-ludo-border rounded-lg px-4 py-3 text-white placeholder-ludo-muted/30 focus:border-ludo-cyan focus:ring-1 focus:ring-ludo-cyan focus:outline-none transition-all font-grotesk"
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="w-full group">
                      Initialize Application
                    </Button>
                    <p className="text-center mt-4 font-mono text-[10px] text-ludo-muted">
                      You can withdraw your consent for data processing at any time. You also have the 'Right to be Forgotten' to request data deletion. To exercise these rights, please contact us at <a href="mailto:ludobotics@gmail.com" className="text-ludo-cyan hover:underline">ludobotics@gmail.com</a>. Your data will be erased without undue delay if conditions are met.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};