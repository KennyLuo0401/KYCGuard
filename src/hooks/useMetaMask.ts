import { useState, useEffect } from 'react';
import { type Address } from 'viem';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const [address, setAddress] = useState<Address | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      handleAccountsChanged(accounts);
    } catch (err) {
      console.error('Error checking MetaMask connection:', err);
      setError('Error checking wallet connection');
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0] as Address);
      setIsConnected(true);
      setError(null);
    } else {
      setAddress(null);
      setIsConnected(false);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    try {
      setError(null);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      handleAccountsChanged(accounts);
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError('Error connecting to wallet');
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  return {
    address,
    isConnected,
    error,
    connect,
    disconnect
  };
}