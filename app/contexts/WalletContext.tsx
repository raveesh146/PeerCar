import { ethers } from 'ethers';
import React, { createContext, useContext, useState } from 'react';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    try {
      setIsLoading(true);
      
      // Check if MetaMask or another wallet is available
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          // Create ethers provider and signer
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          const ethersSigner = await ethersProvider.getSigner();
          const userAddress = await ethersSigner.getAddress();

          setProvider(ethersProvider);
          setSigner(ethersSigner);
          setAddress(userAddress);
          setIsConnected(true);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
            } else {
              disconnect();
            }
          });

          // Listen for disconnect
          window.ethereum.on('disconnect', () => {
            disconnect();
          });
        }
      } else {
        // For React Native, we'll use a mock connection for demo purposes
        // In production, you'd integrate with WalletConnect or other mobile wallets
        const mockAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
        const mockProvider = new ethers.JsonRpcProvider('https://filecoin-calibration.chainup.net/rpc/v1');
        const mockSigner = new ethers.Wallet('0x1234567890123456789012345678901234567890123456789012345678901234', mockProvider);
        
        setProvider(mockProvider as any);
        setSigner(mockSigner as any);
        setAddress(mockAddress);
        setIsConnected(true);
        
        console.log('Mock wallet connected for demo purposes');
      }

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // For demo purposes, create a mock connection
      const mockAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      const mockProvider = new ethers.JsonRpcProvider('https://filecoin-calibration.chainup.net/rpc/v1');
      const mockSigner = new ethers.Wallet('0x1234567890123456789012345678901234567890123456789012345678901234', mockProvider);
      
      setProvider(mockProvider as any);
      setSigner(mockSigner as any);
      setAddress(mockAddress);
      setIsConnected(true);
      
      console.log('Mock wallet connected for demo purposes');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setProvider(null);
    setSigner(null);
  };

  const value: WalletContextType = {
    isConnected,
    address,
    provider,
    signer,
    connect,
    disconnect,
    isLoading,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 