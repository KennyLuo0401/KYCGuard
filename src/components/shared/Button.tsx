import React, { ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ 
  children, 
  variant = 'primary', 
  loading = false,
  icon,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'relative px-6 py-2 rounded-lg font-medium transition-all duration-200 btn-hover-effect';
  
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 text-gray-200',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <LoadingSpinner size={20} />
        ) : (
          <>
            {icon && <span className="w-5 h-5">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </div>
    </button>
  );
}