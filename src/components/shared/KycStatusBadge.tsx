import React from 'react';
import { Shield, ShieldOff, Loader2, Clock, User } from 'lucide-react';
import { type Address } from 'viem';
import { UserOperations } from '../../lib/UserOperations';
import { KycLevel, KycStatus } from '../../types';

interface KycStatusBadgeProps {
  address: string;
  className?: string;
}

export function KycStatusBadge({ address, className = '' }: KycStatusBadgeProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [kycInfo, setKycInfo] = React.useState<{
    level: KycLevel;
    status: KycStatus;
    ensName?: string;
    createTime?: bigint;
  } | null>(null);

  React.useEffect(() => {
    const checkKycStatus = async () => {
      if (!address || address.length !== 42) return;
      
      try {
        setIsLoading(true);
        const userOps = new UserOperations();
        const info = await userOps.getKycInfo(address as Address);
        setKycInfo({
          level: info.level,
          status: info.status,
          ensName: info.ensName,
          createTime: info.createTime
        });
      } catch (err) {
        console.error('Error checking KYC status:', err);
        setKycInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkKycStatus();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [address]);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!address || address.length !== 42) return null;

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 py-3 px-4 bg-gray-800/30 rounded-lg backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ${className}`}>
        <div className="relative flex items-center gap-2">
          <div className="absolute inset-0 bg-gray-400/20 blur-xl rounded-full animate-pulse"></div>
          <Loader2 className="w-4 h-4 animate-spin relative z-10 text-gray-400" />
          <span className="text-sm font-medium text-gray-400 relative z-10">Checking KYC status...</span>
        </div>
      </div>
    );
  }

  if (kycInfo && kycInfo.status === KycStatus.APPROVED && kycInfo.level > KycLevel.NONE) {
    return (
      <div className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${className}`}>
        <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-lg animate-pulse-slow"></div>
        <div className="relative bg-gray-800/40 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <Shield className="w-6 h-6 text-emerald-400 relative z-10 animate-pulse-slow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-emerald-400">
                  KYC Level {kycInfo.level}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <div className="space-y-2">
                {kycInfo.ensName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3.5 h-3.5 text-emerald-300/60" />
                    <span className="text-emerald-300/80 font-medium truncate group-hover:text-emerald-300 transition-colors">
                      {kycInfo.ensName}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-emerald-300/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Verified on {formatDate(kycInfo.createTime || BigInt(0))}</span>
                </div>
                <div className="text-xs text-emerald-300/40 font-mono">
                  {formatAddress(address)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kycInfo && kycInfo.status === KycStatus.REVOKED) {
    return (
      <div className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${className}`}>
        <div className="absolute inset-0 bg-red-500/5 blur-xl rounded-lg"></div>
        <div className="relative bg-gray-800/40 backdrop-blur-sm border border-red-500/20 rounded-lg p-4 shadow-lg shadow-red-500/5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
              <ShieldOff className="w-6 h-6 text-red-400 relative z-10" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-red-400">KYC Revoked</span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                  Invalid
                </span>
              </div>
              <div className="space-y-2">
                {kycInfo.ensName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3.5 h-3.5 text-red-300/60" />
                    <span className="text-red-300/80 font-medium truncate">
                      {kycInfo.ensName}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-red-300/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created on {formatDate(kycInfo.createTime || BigInt(0))}</span>
                </div>
                <div className="text-xs text-red-300/40 font-mono">
                  {formatAddress(address)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${className}`}>
      <div className="absolute inset-0 bg-gray-500/5 blur-xl rounded-lg"></div>
      <div className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-600/20 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-500/20 blur-xl rounded-full"></div>
            <ShieldOff className="w-6 h-6 text-gray-400 relative z-10" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-gray-400">
                Not KYC Verified
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-700/50 text-gray-400 text-xs font-medium border border-gray-600/20">
                Required
              </span>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {formatAddress(address)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}