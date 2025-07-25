import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// @ts-ignore: If you haven't installed, run: expo install react-native-linear-gradient
import { useAppKit } from '@reown/appkit-wagmi-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from './contexts/AuthContext';
import { useWallet } from './contexts/WalletContext';

// Gradient background wrapper
function GradientBackground({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={["#4facfe", "#00f2fe"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      {children}
    </LinearGradient>
  );
}

// Glassmorphic card
function GlassCard({ children, style }: { children: ReactNode; style?: any }) {
  return (
    <View style={[styles.glassCard, style]}>{children}</View>
  );
}

// Gradient button
function GradientButton({ children, onPress, style, disabled }: { children: ReactNode; onPress: () => void; style?: any; disabled?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled} activeOpacity={0.85}>
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientButton, disabled && { opacity: 0.6 }]}
      >
        <Text style={styles.gradientButtonText}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function AuthScreen() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email');
  const [loading, setLoading] = useState(false);
  const { isConnected, address, connect, disconnect, isLoading: walletLoading } = useWallet();
  const { open } = useAppKit();
  const { state: authState, signIn, signOut } = useContext(AuthContext);

  useEffect(() => {
    if (authMethod === 'wallet' && isConnected) {
      router.push('/home');
    }
  }, [isConnected, authMethod]);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.centeredContainer}>
          <GlassCard style={styles.cardContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://api.a0.dev/assets/image?text=PeerCar&aspect=1:1' }}
                style={styles.logo}
              />
              <Text style={styles.appName}>PeerCar</Text>
              <Text style={styles.tagline}>Decentralized Peer-to-Peer Car Rentals Powered by FileCoin</Text>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, authMethod === 'email' && styles.activeTab]}
                onPress={() => setAuthMethod('email')}
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={authMethod === 'email' ? '#4facfe' : '#5f6368'}
                />
                <Text style={[styles.tabText, authMethod === 'email' && styles.activeTabText]}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, authMethod === 'wallet' && styles.activeTab]}
                onPress={() => setAuthMethod('wallet')}
              >
                <Ionicons
                  name="wallet"
                  size={20}
                  color={authMethod === 'wallet' ? '#4facfe' : '#5f6368'}
                />
                <Text style={[styles.tabText, authMethod === 'wallet' && styles.activeTabText]}>Wallet</Text>
              </TouchableOpacity>
            </View>
            {authMethod === 'email' ? (
              <View style={styles.emailContainer}>
                {/* Show Civic button if not authenticated, else show wallet connect and sign out */}
                {!authState.isAuthenticated ? (
                  <GradientButton onPress={signIn} disabled={loading} style={{ marginTop: 18 }}>
                    {loading ? <ActivityIndicator color="#fff" /> : 'Sign in with Civic'}
                  </GradientButton>
                ) : (
                  <View style={{ marginTop: 18, alignItems: 'center' }}>
                    <GradientButton onPress={() => open()} style={{ width: 200, marginBottom: 8 }}>
                      Connect Wallet
                    </GradientButton>
                    <TouchableOpacity onPress={signOut} style={{ marginTop: 8 }}>
                      <Text style={{ color: '#4facfe', fontWeight: 'bold', fontSize: 16 }}>Sign Out</Text>
                    </TouchableOpacity>

                  </View>
                )}
              </View>
            ) : (
              <View style={styles.walletContainer}>
                <View style={{ marginTop: 16, alignItems: 'center' }}>
                  <GradientButton onPress={() => open()} style={{ width: 200, marginBottom: 8 }}>
                    Connect Wallet
                  </GradientButton>
                  <TouchableOpacity onPress={() => router.push('/home')} style={{ marginTop: 8 }}>
                    <Text style={{ color: '#00b894', fontWeight: 'bold', fontSize: 16 }}>Go to Home Page</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </GlassCard>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    minHeight: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: width > 400 ? 400 : '100%',
    borderRadius: 32,
    padding: 28,
    marginVertical: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 32,
    padding: 0,
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: 2,
    letterSpacing: 1.2,
  },
  tagline: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5f6368',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4facfe',
    fontWeight: 'bold',
  },
  emailContainer: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#202124',
    opacity: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    color: '#222',
  },
  gradientButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  gradientButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  walletContainer: {
    marginTop: 8,
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
    marginBottom: 12,
  },
  walletOption: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  walletIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  walletName: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
  },
  walletLoading: {
    marginTop: 24,
  },
  footer: {
    marginTop: 18,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
    opacity: 0.8,
  },
  disconnectButton: {
    backgroundColor: '#4facfe',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  disconnectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  connectBtn: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectText: { color: 'white', fontSize: 16, fontWeight: '600' },
});