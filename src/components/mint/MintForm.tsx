import React from 'react';
import { Coins, AlertCircle } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { KycStatusBadge } from '../shared/KycStatusBadge';

interface MintFormProps {
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  mintAmount: string;
  setMintAmount: (amount: string) => void;
  loading: boolean;
  isConnected: boolean;
  onSubmit: () => void;
}

export function MintForm({
  recipientAddress,
  setRecipientAddress,
  mintAmount,
  setMintAmount,
  loading,
  isConnected,
  onSubmit
}: MintFormProps) {
  return (
    <Card className="transform hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <Coins className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold">Mint Tokens</h2>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Input
            label="Recipient Address"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            disabled={loading || !isConnected}
          />
          <KycStatusBadge address={recipientAddress} className="ml-1" />
        </div>

        <Input
          label="Amount"
          type="number"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          placeholder="0.0"
          disabled={loading || !isConnected}
        />
        
        <Button
          onClick={onSubmit}
          disabled={!isConnected}
          loading={loading}
          icon={<Coins className="w-5 h-5" />}
          className="w-full"
        >
          Mint Tokens
        </Button>

        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Recipient must be KYC verified</span>
        </div>
      </div>
    </Card>
  );
}