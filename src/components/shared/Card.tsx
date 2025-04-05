import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div 
      className={`
        bg-gray-800/50 backdrop-blur-sm 
        rounded-xl p-6 shadow-xl 
        border border-gray-700/50 
        transition-all duration-300 
        hover:shadow-glow 
        ${className}
      `}
    >
      {children}
    </div>
  );
}