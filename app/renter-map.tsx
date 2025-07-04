import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  pricePerDay: string;
  rating: number;
  reviews: number;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  owner: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
}

// Mock data for car listings
const MOCK_CARS: Car[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    pricePerDay: '45',
    rating: 4.8,
    reviews: 24,
    images: ['https://api.a0.dev/assets/image?text=Toyota%20Camry&aspect=16:9'],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Market St, San Francisco, CA'
    },
    owner: {
      id: 'owner1',
      name: 'John Doe',
      avatar: 'https://api.a0.dev/assets/image?text=JD&aspect=1:1',
      rating: 4.9
    }
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: '2021',
    pricePerDay: '40',
    rating: 4.7,
    reviews: 18,
    images: ['https://api.a0.dev/assets/image?text=Honda%20Civic&aspect=16:9'],
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: '456 Union St, San Francisco, CA'
    },
    owner: {
      id: 'owner2',
      name: 'Jane Smith',
      avatar: 'https://api.a0.dev/assets/image?text=JS&aspect=1:1',
      rating: 4.8
    }
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model 3',
    year: '2022',
    pricePerDay: '80',
    rating: 4.9,
    reviews: 32,
    images: ['https://api.a0.dev/assets/image?text=Tesla%20Model%203&aspect=16:9'],
    location: {
      latitude: 37.7900,
      longitude: -122.4100,
      address: '789 Battery St, San Francisco, CA'
    },
    owner: {
      id: 'owner3',
      name: 'Alex Johnson',
      avatar: 'https://api.a0.dev/assets/image?text=AJ&aspect=1:1',
      rating: 5.0
    }
  },
  {
    id: '4',
    make: 'Ford',
    model: 'Mustang',
    year: '2019',
    pricePerDay: '65',
    rating: 4.6,
    reviews: 15,
    images: ['https://api.a0.dev/assets/image?text=Ford%20Mustang&aspect=16:9'],
    location: {
      latitude: 37.7700,
      longitude: -122.4300,
      address: '101 Valencia St, San Francisco, CA'
    },
    owner: {
      id: 'owner4',
      name: 'Sarah Williams',
      avatar: 'https://api.a0.dev/assets/image?text=SW&aspect=1:1',
      rating: 4.7
    }
  }
];

export default function RenterMapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  const cardAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Simulate fetching car data from IPFS
    setTimeout(() => {
      setCars(MOCK_CARS);
      setLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    if (selectedCar) {
      // Animate card up
      Animated.spring(cardAnimation, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate card down
      Animated.spring(cardAnimation, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedCar]);
  
  const handleCarPress = (car: Car) => {
    setSelectedCar(car);
  };
  
  const handleCloseCard = () => {
    setSelectedCar(null);
  };
  
  const handleChatPress = () => {
    if (selectedCar) {
      router.push({ pathname: 'chat', params: { car: JSON.stringify(selectedCar) } } as any);
    }
  };
  
  const cardTranslateY = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const renderCarItem = ({ item }: { item: Car }) => (
    <TouchableOpacity 
      style={styles.carItem} 
      onPress={() => handleCarPress(item)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.carItemImage} />
      <View style={styles.carItemInfo}>
        <Text style={styles.carItemTitle}>{item.year} {item.make} {item.model}</Text>
        <Text style={styles.carItemPrice}>${item.pricePerDay}/day</Text>
        <View style={styles.carItemLocation}>
          <Ionicons name="location-outline" size={14} color="#5f6368" />
          <Text style={styles.carItemLocationText} numberOfLines={1}>
            {item.location.address}
          </Text>
        </View>
        <View style={styles.carItemRating}>
          <Ionicons name="star" size={14} color="#fbbc04" />
          <Text style={styles.carItemRatingText}>{item.rating} ({item.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.title}>Find Nearby Cars</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => {}}
          >
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Finding nearby cars...</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <GlassCard style={styles.mapCard}>
              <View style={styles.mapPlaceholder}>
                <Image 
                  source={{ uri: 'https://api.a0.dev/assets/image?text=Map%20View%20of%20San%20Francisco&aspect=16:9' }} 
                  style={styles.mapImage}
                  resizeMode="cover"
                />
                <View style={styles.mapOverlay}>
                  <Text style={styles.mapText}>San Francisco, CA</Text>
                  <Text style={styles.mapSubtext}>{cars.length} cars available</Text>
                </View>
              </View>
            </GlassCard>
            
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Available Cars Nearby</Text>
              <FlatList
                data={cars}
                renderItem={renderCarItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.carList}
              />
            </View>
            
            <Animated.View 
              style={[
                styles.carCardContainer, 
                { transform: [{ translateY: cardTranslateY }] }
              ]}
            >
              {selectedCar && (
                <GlassCard style={styles.carCard}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleCloseCard}
                  >
                    <Ionicons name="close" size={24} color="#5f6368" />
                  </TouchableOpacity>
                  
                  <Image 
                    source={{ uri: selectedCar.images[0] }} 
                    style={styles.carImage}
                  />
                  
                  <View style={styles.carInfo}>
                    <View style={styles.carHeader}>
                      <View>
                        <Text style={styles.carTitle}>
                          {selectedCar.year} {selectedCar.make} {selectedCar.model}
                        </Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={16} color="#fbbc04" />
                          <Text style={styles.ratingText}>
                            {selectedCar.rating} ({selectedCar.reviews} reviews)
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.priceText}>${selectedCar.pricePerDay}/day</Text>
                    </View>
                    
                    <View style={styles.locationContainer}>
                      <Ionicons name="location-outline" size={16} color="#5f6368" />
                      <Text style={styles.locationText}>{selectedCar.location.address}</Text>
                    </View>
                    
                    <View style={styles.ownerContainer}>
                      <Image source={{ uri: selectedCar.owner.avatar }} style={styles.ownerAvatar} />
                      <View style={styles.ownerInfo}>
                        <Text style={styles.ownerName}>{selectedCar.owner.name}</Text>
                        <View style={styles.ownerRating}>
                          <Ionicons name="star" size={14} color="#fbbc04" />
                          <Text style={styles.ownerRatingText}>{selectedCar.owner.rating}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <GradientButton onPress={handleChatPress} style={{ marginTop: 16 }}>
                      Chat with Owner
                    </GradientButton>
                  </View>
                </GlassCard>
              )}
            </Animated.View>
          </View>
        )}
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
    borderRadius: 32,
    padding: 0,
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 24,
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mapCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#4facfe',
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  carList: {
    paddingBottom: 16,
  },
  carItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#4facfe',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  carItemImage: {
    width: 120,
    height: 100,
  },
  carItemInfo: {
    flex: 1,
    padding: 12,
  },
  carItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 4,
  },
  carItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: 8,
  },
  carItemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  carItemLocationText: {
    fontSize: 12,
    color: '#5f6368',
    marginLeft: 4,
    flex: 1,
  },
  carItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carItemRatingText: {
    fontSize: 12,
    color: '#5f6368',
    marginLeft: 4,
  },
  carCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  carCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: 180,
  },
  carInfo: {
    padding: 16,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#5f6368',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#5f6368',
    flex: 1,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ownerRatingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#5f6368',
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
});