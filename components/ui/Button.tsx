import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, icon, className = '', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-8 py-3 font-orbitron text-sm font-bold tracking-widest uppercase transition-all duration-300 clip-path-slant";
  
  const variants = {
    primary: "bg-ludo-cyan text-ludo-deep hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] border border-transparent",
    secondary: "bg-transparent text-ludo-cyan border border-ludo-cyan hover:bg-ludo-cyan/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]",
    ghost: "bg-transparent text-ludo-muted hover:text-ludo-cyan hover:bg-ludo-cyan/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </motion.button>
  );
};