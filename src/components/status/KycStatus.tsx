import React from 'react';
import { Shield } from 'lucide-react';
import { KycLevel, KycStatus as KycStatusType, type KycInfo } from '../../types';
import { Card } from '../shared/Card';

interface KycStatusProps {
  kycInfo: KycInfo | null;
  isConnected: boolean;
  address?: string;
}

export function KycStatus({ kycInfo, isConnected, address }: KycStatusProps) {
  const getKycStatusColor = () => {
    if (!kycInfo) return 'text-gray-400';
    if (kycInfo.level === KycLevel.NONE) return 'text-gray-400';
    return kycInfo.status === KycStatusType.APPROVED ? 'text-emerald-400' : 'text-red-400';
  };

  const getKycStatusText = () => {
    if (!isConnected) return 'Not Connected';
    if (!kycInfo) return 'Not Verified';
    if (kycInfo.level === KycLevel.NONE) return 'Not Verified';
    return kycInfo.status === KycStatusType.APPROVED ? 'Verified' : 'Revoked';
  };

  return (
    <Card className="mt-8 transform hover:scale-[1.01] transition-transform duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${getKycStatusColor().replace('text-', 'bg-').replace('400', '400/20')}`}>
            <Shield className={`w-6 h-6 ${getKycStatusColor()}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">KYC Status:</span>
              <span className={`${getKycStatusColor()} font-semibold`}>
                {getKycStatusText()}
              </span>
            </div>
            {kycInfo?.level !== KycLevel.NONE && (
              <span className="text-sm text-gray-400 block mt-1">
                Level {kycInfo?.level} Verification
              </span>
            )}
          </div>
        </div>
        <div className="text-sm">
          {isConnected && address ? (
            <div className="flex items-center space-x-2 bg-gray-700/30 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-gray-300">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          ) : (
            <div className="text-gray-400">Not Connected</div>
          )}
        </div>
      </div>
    </Card>
  );
}