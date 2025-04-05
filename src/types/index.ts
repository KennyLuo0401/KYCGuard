export enum KycLevel {
  NONE = 0,
  BASIC = 1,
  ADVANCED = 2,
  PREMIUM = 3,
  ULTIMATE = 4
}

export enum KycStatus {
  APPROVED = 1,
  REVOKED = 2
}

export interface KycInfo {
  ensName: string;
  level: KycLevel;
  status: KycStatus;
  createTime: bigint;
}