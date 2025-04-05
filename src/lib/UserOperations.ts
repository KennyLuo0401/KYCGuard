import { createPublicClient, http, type Address } from 'viem';
import { hashkeyTestnet } from 'viem/chains';
import { KYC_SBT_ADDRESS } from '../config/contracts';
import { type KycInfo, KycLevel, KycStatus } from '../types/index';

// Initialize public client for read operations
const publicClient = createPublicClient({
  chain: hashkeyTestnet,
  transport: http('https://hashkey-testnet.drpc.org')
});

export class UserOperations {
  async getKycInfo(address: Address): Promise<KycInfo> {
    try {
      const result = await publicClient.readContract({
        address: KYC_SBT_ADDRESS,
        abi: [{
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "getUserKycInfo",
          outputs: [
            { internalType: "string", name: "ensName", type: "string" },
            { internalType: "enum IKycSBT.KycLevel", name: "level", type: "uint8" },
            { internalType: "enum IKycSBT.KycStatus", name: "status", type: "uint8" },
            { internalType: "uint256", name: "createTime", type: "uint256" }
          ],
          stateMutability: "view",
          type: "function"
        }],
        functionName: 'getUserKycInfo',
        args: [address],
      }) as [string, number, number, bigint];

      return {
        ensName: result[0],
        level: result[1] as KycLevel,
        status: result[2] as KycStatus,
        createTime: result[3]
      };
    } catch (error) {
      console.error('Error getting KYC info:', error);
      throw error;
    }
  }

  async isHuman(address: Address) {
    try {
      const [isValid, level] = await publicClient.readContract({
        address: KYC_SBT_ADDRESS,
        abi: [{
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "isHuman",
          outputs: [
            { internalType: "bool", name: "", type: "bool" },
            { internalType: "uint8", name: "", type: "uint8" }
          ],
          stateMutability: "view",
          type: "function"
        }],
        functionName: 'isHuman',
        args: [address],
      }) as [boolean, number];

      return {
        isValid,
        level: level as KycLevel
      };
    } catch (error) {
      console.error('Error checking human status:', error);
      throw error;
    }
  }
}