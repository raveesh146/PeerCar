import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

export default function HomeScreen() {
  const router = useRouter();

  const handleRenterPress = () => {
    router.push('/renter-map');
  };

  const handleListerPress = () => {
    router.push('/car-listing');
  };

  const handleMarketplacePress = () => {
    router.push('/marketplace');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.centeredContainer}>
          <GlassCard style={styles.cardContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://api.a0.dev/assets/image?text=PeerCar%20P2P%20Car%20Rental&aspect=1:1' }}
                style={styles.logo}
              />
              <Text style={styles.appName}>PeerCar</Text>
              <Text style={styles.tagline}>Decentralized P2P Car Rentals</Text>
            </View>
            <View style={styles.roleContainer}>
              <Text style={styles.roleTitle}>Choose your role:</Text>
              <GradientButton onPress={handleRenterPress} style={{ marginBottom: 16 }}>
                I want to rent a car
              </GradientButton>
              <GradientButton onPress={handleListerPress} style={{ marginBottom: 16 }}>
                I want to list my car
              </GradientButton>
              <GradientButton onPress={handleMarketplacePress}>
                Browse Car Marketplace
              </GradientButton>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Powered by FileCoin Contracts and Web3Storage</Text>
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
    width: 100,
    height: 100,
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
  roleContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#202124',
    opacity: 0.9,
  },
  gradientButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 0,
  },
  gradientButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
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
});
