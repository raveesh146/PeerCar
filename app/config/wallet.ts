// WalletConnect Configuration
// Get your project ID from https://cloud.walletconnect.com/
export const WALLET_CONNECT_CONFIG = {
  projectId: 'ba6df94b676bdc3f1a2cb25aeb310afa', // Replace with your actual project ID
  chains: [314159], // Filecoin Calibration testnet
  rpcMap: {
    314159: 'https://filecoin-calibration.chainup.net/rpc/v1',
  },
}; 