import React from 'react';
import { Github, Linkedin, Youtube, Mail, FileText } from 'lucide-react';
import footerLogo from '../assets/footer_logo.png';


interface FooterProps {
  onOpenTRD?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTRD }) => {
  return (
    <footer className="bg-[#010408] border-t border-ludo-border/20 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={footerLogo} alt="LUDOBOTICS" className="h-20 w-auto" />
            </div>
            <p className="font-grotesk text-ludo-muted text-sm leading-relaxed max-w-sm">
              University of Luxembourg Early-Stage Venture.
              <br />
              Game-Based Immersive Learning for Robotics & Autonomous Systems.
            </p>
          </div>

          <div>
            <h4 className="font-orbitron font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-ludo-panel border border-ludo-border rounded-lg flex items-center justify-center text-ludo-muted hover:text-ludo-cyan hover:border-ludo-cyan transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-ludo-panel border border-ludo-border rounded-lg flex items-center justify-center text-ludo-muted hover:text-ludo-cyan hover:border-ludo-cyan transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-ludo-panel border border-ludo-border rounded-lg flex items-center justify-center text-ludo-muted hover:text-ludo-cyan hover:border-ludo-cyan transition-all">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-orbitron font-bold text-white mb-4">Resources</h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={onOpenTRD}
                className="flex items-center gap-2 text-ludo-muted hover:text-ludo-cyan transition-colors group text-left"
              >
                <FileText size={16} className="group-hover:scale-110 transition-transform" />
                <span className="font-grotesk text-sm">Technical Requirements</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-orbitron font-bold text-white mb-4">Contact</h4>
            <a href="mailto:contact@ludobotics.com" className="flex items-center gap-2 text-ludo-muted hover:text-white transition-colors">
              <Mail size={16} />
              <span className="font-grotesk text-sm">contact@ludobotics.com</span>
            </a>
          </div>

        </div>

        <div className="border-t border-ludo-border/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-ludo-muted">
            © 2026 Ludobotics. All rights reserved.
          </p>
          <div className="flex gap-6 font-mono text-xs text-ludo-muted">
            <a href="#" className="hover:text-ludo-cyan">Privacy Policy</a>
            <a href="#" className="hover:text-ludo-cyan">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};