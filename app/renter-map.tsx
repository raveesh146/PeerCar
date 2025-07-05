import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function RenterMapScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const handleMapPress = (e: any) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocating(false);
      alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    });
    setMarker({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setLocating(false);
  };

  const handleShowCars = () => {
    if (!marker) {
      alert('Please select a location by dropping a pin or using your current location.');
      return;
    }
    // Pass the selected location to the marketplace as a filter
    router.push({ pathname: '/marketplace', params: { lat: marker.latitude, lng: marker.longitude } } as any);
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
          <Text style={styles.title}>Find Cars Near You</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>
          <TouchableOpacity style={styles.locateButton} onPress={handleUseCurrentLocation} disabled={locating}>
            <Ionicons name="locate" size={24} color="#fff" />
            <Text style={styles.locateButtonText}>{locating ? 'Locating...' : 'Use My Location'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.showCarsButton} onPress={handleShowCars}>
            <Text style={styles.showCarsButtonText}>Show Cars Near This Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    minHeight: '100%',
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
  mapContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#e3f2fd',
    elevation: 4,
  },
  map: {
    width: '100%',
    height: height * 0.5,
  },
  locateButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4facfe',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 2,
  },
  locateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  showCarsButton: {
    backgroundColor: '#34a853',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 2,
  },
  showCarsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});