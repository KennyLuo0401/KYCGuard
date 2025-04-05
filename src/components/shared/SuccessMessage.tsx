import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string | null;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-fade-in">
      <div className="mx-4">
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-lg group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-emerald-500/20 rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                  <CheckCircle className="w-5 h-5 text-emerald-400 relative z-10" />
                </div>
                <p className="flex-1 text-sm font-medium text-emerald-400 leading-5">
                  {message}
                </p>
                <button
                  onClick={() => setVisible(false)}
                  className="flex-shrink-0 text-emerald-400/60 hover:text-emerald-400 transition-colors p-1 hover:bg-emerald-500/10 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-1 bg-emerald-500/10 relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-emerald-400/20 w-full animate-[shrink_3.5s_linear_forwards]"
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}