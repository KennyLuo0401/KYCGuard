import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        className={`
          w-full bg-gray-700/50 
          rounded-lg px-4 py-2 
          border border-gray-600/50
          focus:ring-2 focus:ring-emerald-400 
          focus:outline-none
          transition-all duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${error ? 'border-red-400' : 'hover:border-gray-500'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}