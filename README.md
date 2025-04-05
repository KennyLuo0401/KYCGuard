# KYCGuard

This project demonstrates a KYC-compliant contract system that integrates with the HashKey KYC infrastructure. The system ensures that only verified users can receive or transfer certified tokens and NFTs. It also prevents unauthorized accounts from interacting with compliant assets.

## Project Overview

- **Features:**
  - **KYC Verification:** Users must complete KYC verification through HashKey to interact with the system.
  - **Transfer Tokens:** Only verified users can receive certified tokens.
  - **Transfer NFTs:** Only KYC-verified users can hold or transfer compliant NFTs.
  - **Mint Tokens:** New tokens can only be minted to verified addresses.
  
- **Front-end Demo:**  
  A demo front-end application is available to interact with the system.  
  - **Demo URL:** [KYC-Compliant Demo Frontend](https://delicate-sorbet-6a06cf.netlify.app/)

## Key Features and Usage

### 1. KYC Verification
   - **Requirement:** Users must have a verified HashKey KYC account.  
   - **Functionality:** The contract queries HashKey’s KYC infrastructure to confirm the user’s compliance status. Without verification, users cannot receive or transfer certified assets.  
   - **HashKey Testnet KYC Site:**  
     Users can complete the KYC process on the testnet by visiting the [HashKey KYC Testnet Site](https://kyc-testnet.hunyuankyc.com/).

### 2. Transfer Tokens
   - **Restriction:**  
     - Tokens can only be transferred to addresses that have completed KYC verification.  
     - Attempts to transfer tokens to non-compliant addresses will be rejected.

### 3. Transfer NFTs
   - **Restriction:**  
     - Compliant NFTs can only be sent to verified addresses.  
     - If the recipient is not KYC-verified, the transfer will fail.

### 4. Mint Tokens
   - **Restriction:**  
     - New tokens can only be minted to addresses that have passed KYC.  
     - This ensures that only verified users can hold compliant assets from the moment they are created.

## Deployment Instructions

### 1. **Clone the Repository:**
   ```bash
   git clone https://github.com/KennyLuo0401/KYCGuard
   cd kyc-nft-token

 ### 2. **Compile and Deploy the Contracts:**
    - Use your preferred development environment (e.g., Hardhat, Remix).
    - Deploy the KYC contract and record its address.
    - Deploy the token and NFT contracts, passing the KYC contract address as a parameter.

### 3. **Interact Using the Demo Front-End:**
    - Navigate to the demo URL: KYC-Compliant Demo Frontend.
    - Connect your wallet and perform operations (transfer, mint, etc.) through the UI.
    - Ensure your account is KYC-verified before attempting any transactions.
    - Complete your KYC verification on the testnet here: HashKey KYC Testnet Site.

## Testing and Verification
    - Test Scenarios:
        1. Attempt to transfer a token to a verified user (should succeed).
        2. Attempt to transfer a token to a non-verified user (should fail).
        3. Mint new tokens to a verified user (should succeed).
        4. Transfer an NFT to a verified user (should succeed).
        5. Transfer an NFT to a non-verified user (should fail).

## Verification Tools:
    - Use the demo front-end to simulate real-world usage.
    - Ensure your wallet is connected and KYC-compliant before testing.