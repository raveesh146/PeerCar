import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarListing, useCarData } from './contexts/CarDataContext';

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

export default function MarketplaceScreen() {
  const router = useRouter();
  const { cars, getNewestCar } = useCarData();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'my-cars'>('all');
  const [showWelcome, setShowWelcome] = useState(true);

  const filteredCars = cars.filter(car => {
    if (selectedFilter === 'available') return car.isAvailable;
    if (selectedFilter === 'my-cars') return car.owner === '0x742d35...4d8b6';
    return true;
  });

  const handleRentCar = (car: CarListing) => {
    // Navigate to rental flow
    router.push('/rental-flow');
  };

  const handleViewDetails = (car: CarListing) => {
    // In a real app, this would show detailed car information
    console.log(`Viewing details for car ${car.nftId}`);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Car Marketplace</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/car-listing')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Welcome Message - Only show if there are cars */}
        {showWelcome && cars.length > 0 && (
          <GlassCard style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#34a853" />
              <Text style={styles.welcomeTitle}>Welcome to the Marketplace!</Text>
            </View>
            <Text style={styles.welcomeText}>
              Your car has been successfully listed and is now available for rent. 
              You can see it highlighted at the top of the list.
            </Text>
            <TouchableOpacity 
              style={styles.welcomeButton}
              onPress={() => setShowWelcome(false)}
            >
              <Text style={styles.welcomeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
              All Cars
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'available' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('available')}
          >
            <Text style={[styles.filterText, selectedFilter === 'available' && styles.activeFilterText]}>
              Available
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'my-cars' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('my-cars')}
          >
            <Text style={[styles.filterText, selectedFilter === 'my-cars' && styles.activeFilterText]}>
              My Cars
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {filteredCars.map((car, index) => (
            <GlassCard key={car.id} style={[
              styles.carCard,
              index === 0 && styles.newCarCard
            ]}>
              {index === 0 && (
                <View style={styles.newCarBadge}>
                  <Text style={styles.newCarBadgeText}>NEW</Text>
                </View>
              )}
              <View style={styles.carHeader}>
                <View style={styles.carInfo}>
                  <Text style={styles.carName}>{car.name}</Text>
                  <Text style={styles.carLocation}>{car.location}</Text>
                  <Text style={styles.nftId}>NFT: {car.nftId}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${car.pricePerDay}</Text>
                  <Text style={styles.priceLabel}>per day</Text>
                </View>
              </View>

              <Image source={{ uri: car.image }} style={styles.carImage} />

              <View style={styles.carFooter}>
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerLabel}>Owner:</Text>
                  <Text style={styles.ownerAddress}>{car.owner}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => handleViewDetails(car)}
                  >
                    <Text style={styles.detailsButtonText}>Details</Text>
                  </TouchableOpacity>
                  
                  {car.isAvailable ? (
                    <TouchableOpacity 
                      style={styles.rentButton}
                      onPress={() => handleRentCar(car)}
                    >
                      <Text style={styles.rentButtonText}>Rent Now</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.unavailableButton}>
                      <Text style={styles.unavailableButtonText}>Unavailable</Text>
                    </View>
                  )}
                </View>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
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
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  filterText: {
    color: '#fff',
    fontWeight: '500',
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  carCard: {
    marginBottom: 16,
  },
  newCarCard: {
    borderColor: '#34a853',
    borderWidth: 2,
  },
  newCarBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#34a853',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  newCarBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(52, 168, 83, 0.1)',
    borderColor: '#34a853',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 16,
  },
  welcomeButton: {
    backgroundColor: '#34a853',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  welcomeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 4,
  },
  carLocation: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 4,
  },
  nftId: {
    fontSize: 12,
    color: '#4facfe',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34a853',
  },
  priceLabel: {
    fontSize: 12,
    color: '#5f6368',
  },
  carImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  carFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 12,
    color: '#5f6368',
  },
  ownerAddress: {
    fontSize: 12,
    color: '#202124',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  detailsButtonText: {
    color: '#202124',
    fontWeight: '600',
    fontSize: 14,
  },
  rentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#34a853',
  },
  rentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  unavailableButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ff5252',
  },
  unavailableButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
}); 