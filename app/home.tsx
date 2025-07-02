import { useRouter } from 'expo-router';
import { default as React} from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleRenterPress = () => {
    router.push('/renter-map');
  };

  const handleListerPress = () => {
    router.push('/car-listing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PeerCar</Text>
        <Text style={styles.subtitle}>Decentralized P2P Car Rentals</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://api.a0.dev/assets/image?text=PeerCar%20P2P%20Car%20Rental&aspect=1:1' }} 
          style={styles.image} 
        />
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleTitle}>Choose your role:</Text>

        <TouchableOpacity 
          style={[styles.roleButton, styles.renterButton]} 
          onPress={handleRenterPress}
        >
          <Text style={styles.roleButtonText}>I want to rent a car</Text>
          <Text style={styles.roleDescription}>Browse nearby available cars</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleButton, styles.listerButton]} 
          onPress={handleListerPress}
        >
          <Text style={styles.roleButtonText}>I want to list my car</Text>
          <Text style={styles.roleDescription}>Earn money by renting out your car</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by IPFS & Decentralized Technology</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  roleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleButton: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  renterButton: {
    backgroundColor: '#1a73e8',
  },
  listerButton: {
    backgroundColor: '#34a853',
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#5f6368',
  },
});
