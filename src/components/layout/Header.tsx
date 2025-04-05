import React from 'react';
import { KeyRound, Lock, Wallet, Fingerprint } from 'lucide-react';
import { useMetaMask } from '../../hooks/useMetaMask';

export function Header() {
  const { address, isConnected, error, connect, disconnect } = useMetaMask();

  return (
    <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
              
              {/* Logo composition */}
              <div className="relative z-10 flex">
                <div className="relative">
                  <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse-slow" />
                  <KeyRound className="w-6 h-6 text-emerald-300 absolute -bottom-1 -right-1 transform rotate-45" />
                </div>
                <Lock className="w-5 h-5 text-emerald-200 absolute -top-1 -right-1" />
              </div>
            </div>
            
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                <span className="text-gradient">KYC</span>
                <span className="text-white ml-2">Guard</span>
              </h1>
              <p className="text-sm text-gray-400 font-medium tracking-wide flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Identity</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Security</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span>Trust</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition duration-200 font-medium"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connect}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition duration-200 font-medium shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect MetaMask</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </header>
  );
}