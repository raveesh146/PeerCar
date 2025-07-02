import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CarData {
  make: string;
  model: string;
  year: string;
  description: string;
  pricePerDay: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export default function CarListingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [carData, setCarData] = useState<CarData>({
    make: '',
    model: '',
    year: '',
    description: '',
    pricePerDay: '',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'San Francisco, CA'
    }
  });

  const handleInputChange = (field: keyof CarData, value: string) => {
    setCarData({
      ...carData,
      [field]: value
    });
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 5 images');
      return;
    }

    // For demo purposes, we'll use the image generation API
    const placeholderImage = `https://api.a0.dev/assets/image?text=${carData.make || 'Car'} ${carData.model || ''}&aspect=16:9`;
    setImages([...images, placeholderImage]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const getCurrentLocation = () => {
    // In a real app, we would use geolocation
    // For demo purposes, we'll use a fixed location
    Alert.alert('Location Updated', 'Your current location has been set as the car location');
    setCarData({
      ...carData,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      }
    });
  };

  const uploadDocument = async (type: string) => {
    // Simulate document upload
    Alert.alert(`${type} Uploaded`, `Your ${type.toLowerCase()} has been uploaded successfully`);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!carData.make || !carData.model || !carData.year || !carData.pricePerDay) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one image of your car');
      return;
    }

    setLoading(true);

    try {
      // In a real app, we would upload to IPFS using nft.storage or web3.storage
      // For demo purposes, we'll simulate the upload with a timeout
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Listing Created!', 
          'Your car has been listed successfully and is now available for rent',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/') 
            }
          ]
        );
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/')}
        >
          <Ionicons name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
        <Text style={styles.title}>List Your Car</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Photos</Text>
          <Text style={styles.sectionDescription}>
            Upload clear photos of your car (max 5)
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.carImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff5252" />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={pickImage}
              >
                <Ionicons name="add" size={40} color="#1a73e8" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Details</Text>
          
          <Text style={styles.inputLabel}>Make *</Text>
          <TextInput
            style={styles.input}
            value={carData.make}
            onChangeText={(text) => handleInputChange('make', text)}
            placeholder="e.g. Toyota"
          />

          <Text style={styles.inputLabel}>Model *</Text>
          <TextInput
            style={styles.input}
            value={carData.model}
            onChangeText={(text) => handleInputChange('model', text)}
            placeholder="e.g. Camry"
          />

          <Text style={styles.inputLabel}>Year *</Text>
          <TextInput
            style={styles.input}
            value={carData.year}
            onChangeText={(text) => handleInputChange('year', text)}
            placeholder="e.g. 2020"
            keyboardType="number-pad"
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={carData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            placeholder="Describe your car, its features, condition, etc."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.inputLabel}>Price Per Day (USD) *</Text>
          <TextInput
            style={styles.input}
            value={carData.pricePerDay}
            onChangeText={(text) => handleInputChange('pricePerDay', text)}
            placeholder="e.g. 45"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {carData.location.address}
            </Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.locationButtonText}>Set Current Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapPlaceholder}>
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=Map%20Location&aspect=16:9' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Text style={styles.sectionDescription}>
            Upload required documents for verification
          </Text>

          <TouchableOpacity 
            style={styles.documentButton}
            onPress={() => uploadDocument('Insurance')}
          >
            <Ionicons name="document-text-outline" size={24} color="#1a73e8" />
            <Text style={styles.documentButtonText}>Upload Insurance</Text>
            <Ionicons name="chevron-forward" size={24} color="#5f6368" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.documentButton}
            onPress={() => uploadDocument('Registration')}
          >
            <Ionicons name="card-outline" size={24} color="#1a73e8" />
            <Text style={styles.documentButtonText}>Upload Registration</Text>
            <Ionicons name="chevron-forward" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>List on IPFS</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 16,
  },
  imageScrollView: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  carImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 150,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1a73e8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: '#1a73e8',
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#202124',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  locationButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#e8eaed',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  documentButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#202124',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});