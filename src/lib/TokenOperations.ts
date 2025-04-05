import { createPublicClient, http, type Address, encodeFunctionData, parseEther } from 'viem';
import { hashkeyTestnet } from 'viem/chains';
import { KYC_TOKEN_ADDRESS } from '../config/contracts';
import KycTokenAbi from '../abis/KycProtectedToken.json';

// Initialize public client for read operations
const publicClient = createPublicClient({
  chain: hashkeyTestnet,
  transport: http('https://hashkey-testnet.drpc.org')
});

const mintAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mintTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export class TokenOperations {
  getContractAddress() {
    return KYC_TOKEN_ADDRESS;
  }

  encodeMint(to: Address, amount: bigint) {
    return encodeFunctionData({
      abi: mintAbi,
      functionName: 'mintTokens',
      args: [to, amount]
    });
  }

  encodeRequestKyc(ensName: string) {
    return encodeFunctionData({
      abi: KycTokenAbi,
      functionName: 'requestKyc',
      args: [ensName]
    });
  }

  encodeTransfer(to: Address, amount: bigint) {
    return encodeFunctionData({
      abi: KycTokenAbi,
      functionName: 'transfer',
      args: [to, amount]
    });
  }

  encodeTransferNft(from: Address, to: Address, tokenId: bigint) {
    return encodeFunctionData({
      abi: KycTokenAbi,
      functionName: 'safeTransferFrom',
      args: [from, to, tokenId]
    });
  }

  async getKycFee(): Promise<bigint> {
    try {
      const fee = await publicClient.readContract({
        address: KYC_TOKEN_ADDRESS,
        abi: KycTokenAbi,
        functionName: 'getKycFee',
      });
      return fee as bigint;
    } catch (error) {
      console.warn('Warning: Could not get KYC fee from contract, using default fee:', error);
      // Return default fee if contract call fails
      return parseEther('0.02');
    }
  }

  async estimateGas(from: Address, to: Address, data: string, value: bigint = BigInt(0)) {
    try {
      const gasEstimate = await publicClient.estimateGas({
        account: from,
        to,
        data,
        value
      });
      
      // Add 20% buffer to gas estimate
      return (gasEstimate * BigInt(120)) / BigInt(100);
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  async balanceOf(address: Address) {
    try {
      const balance = await publicClient.readContract({
        address: KYC_TOKEN_ADDRESS,
        abi: KycTokenAbi,
        functionName: 'balanceOf',
        args: [address],
      });
      return balance as bigint;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }
}