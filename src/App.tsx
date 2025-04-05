import React, { useState, useEffect } from 'react';
import { type Address, formatEther } from 'viem';
import { UserOperations } from './lib/UserOperations';
import { TokenOperations } from './lib/TokenOperations';
import { type KycInfo } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { KycRequestForm } from './components/kyc/KycRequestForm';
import { TransferForm } from './components/transfer/TransferForm';
import { NftTransferForm } from './components/transfer/NftTransferForm';
import { MintForm } from './components/mint/MintForm';
import { KycStatus } from './components/status/KycStatus';
import { ErrorDisplay } from './components/shared/ErrorDisplay';
import { SuccessMessage } from './components/shared/SuccessMessage';
import { Tabs } from './components/shared/Tabs';
import { UserCheck, Send, Image, Coins } from 'lucide-react';
import { useMetaMask } from './hooks/useMetaMask';

function App() {
  const [activeTab, setActiveTab] = useState('kyc');
  const [ensName, setEnsName] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nftRecipientAddress, setNftRecipientAddress] = useState('');
  const [mintRecipientAddress, setMintRecipientAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [kycInfo, setKycInfo] = useState<KycInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [kycFee, setKycFee] = useState<bigint>(BigInt(0));

  const { address, isConnected } = useMetaMask();
  const userOps = new UserOperations();
  const tokenOps = new TokenOperations();

  const tabs = [
    { id: 'kyc', label: 'KYC Verification', icon: <UserCheck /> },
    { id: 'token', label: 'Transfer Token', icon: <Send /> },
    { id: 'nft', label: 'Transfer NFT', icon: <Image /> },
    { id: 'mint', label: 'Mint Token', icon: <Coins /> },
  ];

  useEffect(() => {
    const initializeData = async () => {
      if (!isConnected || !address) return;
      
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const fee = await tokenOps.getKycFee();
        setKycFee(fee);

        try {
          const info = await userOps.getKycInfo(address);
          setKycInfo(info);
        } catch (kycErr) {
          console.log('No KYC info found for address:', address);
          setKycInfo(null);
        }
      } catch (err) {
        console.error('Error initializing data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while initializing data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [isConnected, address]);

  const validateEnsName = (name: string): boolean => {
    return name.length >= 5 && name.toLowerCase().endsWith('.hsk');
  };

  const waitForTransaction = async (txHash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 30;
      let attempts = 0;
      
      const checkTx = setInterval(async () => {
        if (attempts >= maxAttempts) {
          clearInterval(checkTx);
          reject(new Error('Transaction confirmation timeout'));
          return;
        }

        try {
          const receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash]
          });

          if (receipt) {
            clearInterval(checkTx);
            if (receipt.status === '0x1') {
              resolve(true);
            } else {
              console.error('Transaction failed. Receipt:', receipt);
              reject(new Error('Transaction failed. Please check your wallet for details.'));
            }
          }
        } catch (err) {
          clearInterval(checkTx);
          console.error('Error checking transaction:', err);
          reject(err);
        }

        attempts++;
      }, 2000);
    });
  };

  const handleMint = async () => {
    if (!isConnected || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    if (!mintRecipientAddress || !mintAmount) {
      setError('Please enter recipient address and amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const data = tokenOps.encodeMint(
        mintRecipientAddress as Address,
        BigInt(mintAmount)
      );

      const gasLimit = await tokenOps.estimateGas(
        address as Address,
        tokenOps.getContractAddress(),
        data
      );

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenOps.getContractAddress(),
          data,
          gas: `0x${gasLimit.toString(16)}`
        }]
      });

      console.log('Transaction submitted. Hash:', txHash);
      await waitForTransaction(txHash);
      
      setSuccess(`Successfully minted ${mintAmount} tokens to ${mintRecipientAddress}`);
      setMintAmount('');
      setMintRecipientAddress('');

    } catch (err) {
      console.error('Error minting tokens:', err);
      if (err instanceof Error && err.message.includes('user rejected')) {
        setError('Transaction was rejected. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Minting failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const requestKyc = async () => {
    if (!isConnected || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    if (!ensName) {
      setError('Please enter an ENS name');
      return;
    }

    if (!validateEnsName(ensName)) {
      setError('Invalid ENS name. Must end with .hsk');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const fee = await tokenOps.getKycFee();
      if (fee === BigInt(0)) {
        throw new Error('Failed to get KYC fee');
      }

      const data = tokenOps.encodeRequestKyc(ensName);
      
      let gasLimit;
      try {
        gasLimit = await tokenOps.estimateGas(
          address as Address,
          tokenOps.getContractAddress(),
          data,
          fee
        );
      } catch (gasErr) {
        console.error('Gas estimation failed:', gasErr);
        throw new Error('Transaction would fail. Please ensure you have enough funds and a valid ENS name.');
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenOps.getContractAddress(),
          value: `0x${fee.toString(16)}`,
          data,
          gas: `0x${gasLimit.toString(16)}`
        }]
      });

      console.log('Transaction submitted. Hash:', txHash);
      
      await waitForTransaction(txHash);
      
      if (address) {
        try {
          const info = await userOps.getKycInfo(address);
          setKycInfo(info);
          setSuccess('KYC request submitted successfully');
          setEnsName('');
        } catch (kycErr) {
          console.log('KYC info not yet available after transaction');
          setKycInfo(null);
        }
      }

    } catch (err) {
      console.error('Error requesting KYC:', err);
      if (err instanceof Error) {
        if (err.message.includes('user rejected')) {
          setError('Transaction was rejected. Please try again.');
        } else if (err.message.includes('insufficient funds')) {
          setError('Insufficient funds to pay for KYC fee and gas.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to request KYC. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!isConnected || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    if (!recipientAddress || !transferAmount) {
      setError('Please enter recipient address and amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const data = tokenOps.encodeTransfer(
        recipientAddress as Address,
        BigInt(transferAmount)
      );

      const gasLimit = await tokenOps.estimateGas(
        address as Address,
        tokenOps.getContractAddress(),
        data
      );

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenOps.getContractAddress(),
          data,
          gas: `0x${gasLimit.toString(16)}`
        }]
      });

      console.log('Transaction submitted. Hash:', txHash);
      await waitForTransaction(txHash);
      
      setSuccess(`Successfully transferred ${transferAmount} tokens to ${recipientAddress}`);
      setTransferAmount('');
      setRecipientAddress('');

    } catch (err) {
      console.error('Error transferring tokens:', err);
      if (err instanceof Error && err.message.includes('user rejected')) {
        setError('Transaction was rejected. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Transfer failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNftTransfer = async () => {
    if (!isConnected || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    if (!nftRecipientAddress || !tokenId) {
      setError('Please enter recipient address and token ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const { isValid } = await userOps.isHuman(nftRecipientAddress as Address);
      if (!isValid) {
        throw new Error('Recipient is not KYC verified');
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenOps.getContractAddress(),
          data: tokenOps.encodeTransferNft(address as Address, nftRecipientAddress as Address, BigInt(tokenId))
        }]
      });

      console.log('Transaction submitted. Hash:', txHash);
      await waitForTransaction(txHash);
      
      setSuccess(`Successfully transferred NFT #${tokenId} to ${nftRecipientAddress}`);
      setTokenId('');
      setNftRecipientAddress('');

    } catch (err) {
      console.error('Error transferring NFT:', err);
      setError(err instanceof Error ? err.message : 'NFT transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'kyc':
        return (
          <KycRequestForm
            ensName={ensName}
            setEnsName={setEnsName}
            kycFee={formatEther(kycFee)}
            loading={loading}
            isConnected={isConnected}
            onSubmit={requestKyc}
          />
        );
      case 'token':
        return (
          <TransferForm
            recipientAddress={recipientAddress}
            setRecipientAddress={setRecipientAddress}
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            loading={loading}
            isConnected={isConnected}
            onSubmit={handleTransfer}
          />
        );
      case 'nft':
        return (
          <NftTransferForm
            tokenId={tokenId}
            setTokenId={setTokenId}
            recipientAddress={nftRecipientAddress}
            setRecipientAddress={setNftRecipientAddress}
            loading={loading}
            isConnected={isConnected}
            onSubmit={handleNftTransfer}
          />
        );
      case 'mint':
        return (
          <MintForm
            recipientAddress={mintRecipientAddress}
            setRecipientAddress={setMintRecipientAddress}
            mintAmount={mintAmount}
            setMintAmount={setMintAmount}
            loading={loading}
            isConnected={isConnected}
            onSubmit={handleMint}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white animate-gradient">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-28 pb-20">
        <ErrorDisplay error={error} />
        <SuccessMessage message={success} />

        <div className="max-w-2xl mx-auto">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {renderActiveTab()}

          <KycStatus
            kycInfo={kycInfo}
            isConnected={isConnected}
            address={address || undefined}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;