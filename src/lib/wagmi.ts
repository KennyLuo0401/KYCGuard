import { createConfig, http } from 'wagmi';
import { mainnet, hashkeyTestnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get project ID from environment variable or use a valid default for development
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "c4f79cc821944d9680842e34466bfbd9";

// Use window.location.origin in browser, fallback for SSR
const appUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:5173';

// Configure metadata with valid URLs
const metadata = {
  name: 'KYC Protected Token',
  description: 'KYC Protected Token Application',
  url: appUrl,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create the Wagmi config with MetaMask prioritized
export const config = createConfig({
  chains: [mainnet, hashkeyTestnet],
  connectors: [
    // MetaMask and other injected wallets
    injected({
      target: 'metaMask',
      shimDisconnect: true,
    }),
    // WalletConnect as fallback
    walletConnect({
      projectId,
      showQrModal: true,
      metadata,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [hashkeyTestnet.id]: http('https://hashkey-testnet.drpc.org'),
  },
});