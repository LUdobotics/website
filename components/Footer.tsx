import React from 'react';
import { Linkedin, Mail, FileText } from 'lucide-react';
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
              <a href="https://www.linkedin.com/company/ludobotics/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-ludo-panel border border-ludo-border rounded-lg flex items-center justify-center text-ludo-muted hover:text-ludo-cyan hover:border-ludo-cyan transition-all">
                <Linkedin size={20} />
              </a>
              <a href="https://www.reddit.com/user/A_ROS_2_ODYSSEY_Dev/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-ludo-panel border border-ludo-border rounded-lg flex items-center justify-center text-ludo-muted hover:text-ludo-cyan hover:border-ludo-cyan transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.249-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
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
            <a href="mailto:ludobotics@gmail.com" className="flex items-center gap-2 text-ludo-muted hover:text-white transition-colors">
              <Mail size={16} />
              <span className="font-grotesk text-sm">ludobotics@gmail.com</span>
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