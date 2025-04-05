import React from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { KycStatusBadge } from '../shared/KycStatusBadge';

interface NftTransferFormProps {
  tokenId: string;
  setTokenId: (id: string) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  loading: boolean;
  isConnected: boolean;
  onSubmit: () => void;
}

export function NftTransferForm({
  tokenId,
  setTokenId,
  recipientAddress,
  setRecipientAddress,
  loading,
  isConnected,
  onSubmit
}: NftTransferFormProps) {
  return (
    <Card className="transform hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <Send className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold">Transfer NFT</h2>
      </div>
      
      <div className="space-y-6">
        <Input
          label="Token ID"
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter token ID"
          disabled={loading || !isConnected}
        />

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
        
        <Button
          onClick={onSubmit}
          disabled={!isConnected}
          loading={loading}
          icon={<Send className="w-5 h-5" />}
          className="w-full"
        >
          Transfer NFT
        </Button>

        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Recipient must be KYC verified</span>
        </div>
      </div>
    </Card>
  );
}