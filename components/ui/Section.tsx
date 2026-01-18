import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, className = '', children, noPadding = false }) => {
  return (
    <section 
      id={id} 
      className={`relative w-full overflow-hidden ${noPadding ? '' : 'py-20 md:py-32'} ${className}`}
    >
      {children}
    </section>
  );
};