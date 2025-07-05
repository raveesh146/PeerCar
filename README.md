# CarRental DePIN App

A decentralized peer-to-peer car rental platform built with React Native (Expo), Filecoin (FEVM), and stablecoin payments (USDFC). Hosts mint NFTs for cars, renters book and pay in USDFC, and all media (photos, videos, logs) are stored permanently via IPFS/Filecoin.

---

## 🚀 Features

- **Car NFTs:** Mint and list cars as ERC‑721 tokens on Filecoin's EVM (FEVM).
- **Stablecoin Payments:** All fees (listing, rental) paid in USDFC for predictable, USD‑pegged billing.
- **Decentralized Storage:** Car metadata and rental logs stored on IPFS/Filecoin via Web3.Storage (or Lighthouse).
- **Rental Workflow:** Approve & pay rental fee, automated escrow, and on-chain settlement to owner.
- **Log Uploads:** Renters can upload trip videos, damage photos, or receipts with on-chain CID tracking.
- **Owner Dashboard:** Withdraw collected USDFC, view listings & rental history.
- **In-app Chat:** Renters and owners can coordinate via built-in chat.
- **Map-based Discovery:** Find cars near you using an interactive map.
- **Wallet & Email Auth:** Authenticate with AppKit (by Reown) for seamless wallet connection or email login.

---

## 🛠️ Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Frontend           | React Native (Expo)                 |
| Wallet Integration | AppKit (by Reown, wagmi & viem)     |
| Storage Onramp     | Web3.Storage / Lighthouse           |
| Blockchain         | Filecoin FEVM (Calibration Testnet) |
| Smart Contracts    | Solidity (OpenZeppelin, ERC‑721)    |
| Stablecoin         | USDFC (ERC‑20)                      |
| State Management   | React Context                       |
| UI Styling         | Tailwind CSS via `nativewind`       |
| Data Fetching      | @tanstack/react-query               |

---

## 📋 Prerequisites

- Node.js ≥ 16, npm or Yarn
- Expo CLI (`npm install -g expo-cli`)
- MetaMask Mobile or AppKit-compatible wallet
- Filecoin Calibration tFIL & tUSDFC in your test wallet
- Hardhat or Remix to deploy smart contracts

---

## ⚙️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/car-rental-depin.git
   cd car-rental-depin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add polyfills** (in `./app/_layout.tsx`)

   ```js
   import "react-native-url-polyfill/auto";
   import { Buffer } from "buffer";
   global.Buffer = Buffer;
   import process from "process";
   global.process = process;
   ```

4. **Environment Variables**
   Create a `.env` file at project root:

   ```env
   EXPO_PUBLIC_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
   EXPO_PUBLIC_CHAIN_ID=314159
   EXPO_PUBLIC_USDFC_ADDRESS=<USDFC_TOKEN_ADDRESS>
   EXPO_PUBLIC_CONTRACT_ADDRESS=<CarRental_CONTRACT_ADDRESS>
   EXPO_PUBLIC_LISTING_FEE=<LISTING_FEE_IN_USDFC_UNITS>
   WEB3STORAGE_TOKEN=<YOUR_WEB3STORAGE_API_TOKEN>
   ```

5. **Run the app**

   ```bash
   expo start
   ```

   Scan the QR code with Expo Go or run on simulator/emulator.

---

## 🔧 Smart Contract Deployment

1. Open `contracts/CarRental.sol` and confirm constructor args:
   - `USDFC_TOKEN_ADDRESS`
   - `listingFee`
2. Compile & deploy to Calibration testnet (chainId 314159) via Hardhat or Remix.
3. Copy deployed contract address into `.env` as `EXPO_PUBLIC_CONTRACT_ADDRESS`.

---

## 🏗️ Folder Structure

```
├── app/
│   ├── config/
│   │   └── wallet.ts
│   ├── contexts/
│   │   ├── CarDataContext.tsx
│   │   └── WalletContext.tsx
│   ├── _layout.tsx
│   ├── auth.tsx
│   ├── car-listing.tsx
│   ├── chat.tsx
│   ├── home.tsx
│   ├── index.tsx
│   ├── marketplace.tsx
│   ├── rental-flow.tsx
│   └── renter-map.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── contracts/
│   ├── abi.ts
│   └── CarRental.sol
├── metadata/
│   └── metadata/
│       └── honda-civic.json
├── app.json
├── babel.config.js
├── eas.json
├── eslint.config.js
├── index.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🧩 Architecture

```
User <-> React Native App <-> Ethers.js <-> FEVM Smart Contract (CarRental.sol)
                                 |-> Web3.Storage (IPFS/Filecoin)
                                 |-> AppKit (wallet integration)
```
- **NFTs:** Each car is an ERC-721 NFT. Metadata and logs are stored as CIDs on IPFS.
- **Smart Contract:** Handles minting, listing, renting, and log uploads.
- **Storage:** All car data, images, and logs are pinned to IPFS via Web3.Storage.
- **Wallet Integration:** AppKit provides a unified wallet connection experience for users, abstracting away direct WalletConnect or MetaMask integration.
- **Stablecoin Payments:** All payments and fees are in USDFC (ERC-20), ensuring predictable, USD-pegged billing.

---

## 🎯 Usage Examples

### Listing a Car

1. Connect wallet (via AppKit).
2. Navigate to *Marketplace* → *List New Car*.
3. Fill in car details & price per day.
4. Approve `listingFee` USDFC and confirm.
5. Images and documents are uploaded to IPFS/Filecoin; metadata CID is minted as NFT.

### Renting a Car

1. Browse listed cars.
2. Select car & choose rental duration.
3. Approve `price × days` USDFC and confirm.
4. Rental is processed on-chain; payment is handled via wallet.
5. Upload trip logs (optional) after rental. Each log is uploaded to IPFS and the CID is recorded on-chain via `uploadLog(carId, cid)`.

### Owner Dashboard

- View your listed cars, rental history, and withdraw collected USDFC.

### In-app Chat & Map

- Coordinate with renters/owners via chat.
- Use the map to find cars near your location.

---

## 📝 Smart Contract: `CarRental.sol`

- **ERC-721 NFT:** Each car is a unique NFT
- **Key Functions:**
  - `mintCar(carId, metadataCID)` — Mint a new car NFT with metadata CID
  - `listCar(carId)` — List a car for rent
  - `rentCar(carId, duration)` — Rent a car for a period
  - `uploadLog(carId, cid)` — Upload a rental log (CID)
  - `getLogs(carId)` — View all log CIDs for a car
- **Events:** CarMinted, CarListed, CarRented, LogUploaded
- **Stablecoin Integration:** All payments are in USDFC (ERC-20). Listing and rental fees are enforced on-chain.

---

## 🗂️ Example Car Metadata (IPFS JSON)

```json
{
  "name": "Honda Civic 2021",
  "description": "Available for rent in Delhi. Well maintained.",
  "image": "ipfs://bafybeib123.../civic.jpg",
  "attributes": [
    { "trait_type": "Location", "value": "Delhi" },
    { "trait_type": "Availability", "value": "Yes" },
    { "trait_type": "Fuel Type", "value": "Petrol" },
    { "trait_type": "Transmission", "value": "Automatic" }
  ]
}
```

---

## 🔮 Next Steps

- Add retrieval‑fee logic for pay‑per‑download.
- Integrate access control & encryption (Lighthouse).
- Build on mainnet with gas sponsorship or paymaster.
- Enhance UI: reviews, ratings, calendar availability.

---

## 📄 License

MIT © Your Name / Your Org 