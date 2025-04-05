import React from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';

interface KycRequestFormProps {
  ensName: string;
  setEnsName: (name: string) => void;
  kycFee: string;
  loading: boolean;
  isConnected: boolean;
  onSubmit: () => void;
}

export function KycRequestForm({ 
  ensName, 
  setEnsName, 
  kycFee, 
  loading, 
  isConnected, 
  onSubmit 
}: KycRequestFormProps) {
  return (
    <Card className="transform hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <UserCheck className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold">KYC Verification</h2>
      </div>
      
      <div className="space-y-6">
        <Input
          label="ENS Name"
          type="text"
          value={ensName}
          onChange={(e) => setEnsName(e.target.value)}
          placeholder="your-name.hsk"
          disabled={loading || !isConnected}
        />
        
        <Button
          onClick={onSubmit}
          disabled={!isConnected}
          loading={loading}
          icon={<UserCheck className="w-5 h-5" />}
          className="w-full"
        >
          Request KYC Verification
        </Button>

        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>KYC fee required: {kycFee} ETH</span>
        </div>
      </div>
    </Card>
  );
}