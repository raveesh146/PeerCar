import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'wallet'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  console.log('AuthScreen rendering...'); // Debug log
  
  const handleEmailAuth = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, we would use Privy SDK to authenticate
      // For demo purposes, we'll simulate authentication with a timeout
      setTimeout(() => {
        setLoading(false);
        // Navigate to the main app
        router.push('/home');
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Authentication Error', 'Failed to authenticate. Please try again.');
    }
  };
  
  const handleWalletAuth = async (walletType: string) => {
    setLoading(true);
    
    try {
      // In a real app, we would use Privy SDK or WalletConnect for mobile
      // For demo purposes, we'll simulate wallet connection with a timeout
      setTimeout(() => {
        setLoading(false);
        // Navigate to the main app
        router.push('/home');
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Wallet Connection Error', 'Failed to connect wallet. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=PeerCar&aspect=1:1' }} 
            style={styles.logo} 
          />
          <Text style={styles.appName}>PeerCar</Text>
          <Text style={styles.tagline}>Decentralized Peer-to-Peer Car Rentals</Text>
        </View>
        
        <View style={styles.authContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, authMethod === 'email' && styles.activeTab]}
              onPress={() => setAuthMethod('email')}
            >
              <Ionicons 
                name="mail" 
                size={20} 
                color={authMethod === 'email' ? '#1a73e8' : '#5f6368'} 
              />
              <Text 
                style={[styles.tabText, authMethod === 'email' && styles.activeTabText]}
              >
                Email
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, authMethod === 'wallet' && styles.activeTab]}
              onPress={() => setAuthMethod('wallet')}
            >
              <Ionicons 
                name="wallet" 
                size={20} 
                color={authMethod === 'wallet' ? '#1a73e8' : '#5f6368'} 
              />
              <Text 
                style={[styles.tabText, authMethod === 'wallet' && styles.activeTabText]}
              >
                Wallet
              </Text>
            </TouchableOpacity>
          </View>
          
          {authMethod === 'email' ? (
            <View style={styles.emailContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TouchableOpacity 
                style={styles.authButton}
                onPress={handleEmailAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.authButtonText}>Continue with Email</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.walletContainer}>
              <Text style={styles.walletText}>
                Connect your wallet to access decentralized car rentals
              </Text>
              
              <View style={styles.walletOptions}>
                <TouchableOpacity 
                  style={styles.walletOption}
                  onPress={() => handleWalletAuth('metamask')}
                  disabled={loading}
                >
                  <Image 
                    source={{ uri: 'https://api.a0.dev/assets/image?text=Metamask&aspect=1:1' }} 
                    style={styles.walletIcon} 
                  />
                  <Text style={styles.walletName}>MetaMask</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.walletOption}
                  onPress={() => handleWalletAuth('walletconnect')}
                  disabled={loading}
                >
                  <Image 
                    source={{ uri: 'https://api.a0.dev/assets/image?text=WalletConnect&aspect=1:1' }} 
                    style={styles.walletIcon} 
                  />
                  <Text style={styles.walletName}>WalletConnect</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.walletOption}
                  onPress={() => handleWalletAuth('coinbase')}
                  disabled={loading}
                >
                  <Image 
                    source={{ uri: 'https://api.a0.dev/assets/image?text=Coinbase&aspect=1:1' }} 
                    style={styles.walletIcon} 
                  />
                  <Text style={styles.walletName}>Coinbase</Text>
                </TouchableOpacity>
              </View>
              
              {loading && (
                <ActivityIndicator color="#1a73e8" style={styles.walletLoading} />
              )}
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
  },
  authContainer: {
    marginVertical: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#e8eaed',
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5f6368',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1a73e8',
  },
  emailContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#202124',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  walletContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  walletText: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 24,
  },
  walletOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  walletOption: {
    alignItems: 'center',
  },
  walletIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  walletName: {
    fontSize: 14,
    color: '#202124',
  },
  walletLoading: {
    marginTop: 24,
  },
  footer: {
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
});