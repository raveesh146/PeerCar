import { ABI } from '@/contracts/abi';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCarData } from './contexts/CarDataContext';
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

// --- Web3.Storage and contract config ---
const WEB3STORAGE_TOKEN = 'z6MksZuHBpFqchjfDT7XWFCmmwagTewuQGAjxRT3FJnkDvKy'; // TODO: Replace with your token
const CONTRACT_ADDRESS = '0x27Cf885cAe6B448A57786b9328746dE1c7521043'; // TODO: Replace with your contract address
const CONTRACT_ABI = ABI

export default function CarListingScreen() {
  const router = useRouter();
  const { signer, isConnected, connect, disconnect, address, isLoading: walletLoading } = useWallet();
  const { addCar } = useCarData();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [insuranceDoc, setInsuranceDoc] = useState<{ name: string; uri: string } | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<{ name: string; uri: string } | null>(null);
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

  const DEMO_USDFC_BALANCE = 1000;
  const LISTING_FEE = 10;
  const [usdfcApproved, setUsdfcApproved] = useState(false);

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
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (type === 'Insurance') {
          setInsuranceDoc({ name: file.name ?? 'Document', uri: file.uri });
        } else if (type === 'Registration') {
          setRegistrationDoc({ name: file.name ?? 'Document', uri: file.uri });
        }
        Alert.alert(`${type} Uploaded`, `Your ${type.toLowerCase()} has been uploaded successfully`);
      }
    } catch (e) {
      Alert.alert('Error', `Failed to upload ${type.toLowerCase()}. Please try again.`);
    }
  };

  // Helper: upload a file (image, doc, or metadata) to Web3.Storage using HTTP API
  const uploadToWeb3StorageHTTP = async (fileUri: string, fileName: string, mimeType: string = 'application/octet-stream') => {
    // For demo purposes, we'll simulate the upload and return a mock CID
    // In production, you would use the actual Web3.Storage API
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock CID (this is what Web3.Storage would return)
    const mockCid = `bafybeih${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`Mock upload successful for ${fileName}: ${mockCid}`);
    return mockCid;
    
    /* 
    // Real Web3.Storage implementation (uncomment for production)
    const formData = new FormData();
    // @ts-ignore: FormData types for React Native
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    });

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEB3STORAGE_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Web3.Storage error:', response.status, errorText);
      throw new Error(`Failed to upload to Web3.Storage: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.cid; // The returned CID
    */
  };

  // Helper: upload metadata JSON to Web3.Storage using HTTP API
  const uploadMetadataHTTP = async (metadata: any) => {
    // For demo purposes, we'll simulate the upload and return a mock CID
    // In production, you would use the actual Web3.Storage API
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock CID for metadata
    const mockCid = `bafybeih${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`Mock metadata upload successful: ${mockCid}`, metadata);
    return mockCid;
    
    /*
    // Real Web3.Storage implementation (uncomment for production)
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', blob, 'metadata.json');

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEB3STORAGE_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Web3.Storage metadata error:', response.status, errorText);
      throw new Error(`Failed to upload metadata to Web3.Storage: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.cid;
    */
  };

  const mintNFT = async (metadataCid: string) => {
    if (!isConnected || !signer) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      // For demo purposes, we'll simulate the NFT minting
      // In production, you would call the actual smart contract
      
      console.log(`Mock NFT minting for metadata CID: ${metadataCid}`);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return a mock transaction receipt
      const mockReceipt = {
        transactionHash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 100000),
        status: 1
      };
      
      console.log('Mock NFT minted successfully:', mockReceipt);
      return mockReceipt;
      
      /*
      // Real contract interaction (uncomment for production)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Call the mintCar function with the metadata CID
      const tx = await contract.mintCar(1, `ipfs://${metadataCid}`); // carId = 1 for demo
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt;
      */
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  };

  const handleApproveUSDFC = () => {
    setTimeout(() => {
      setUsdfcApproved(true);
      Alert.alert('USDFC Approved!', 'You have approved the contract to spend your USDFC.');
    }, 500);
  };

  const handleSubmit = async () => {
    if (DEMO_USDFC_BALANCE < LISTING_FEE) {
      Alert.alert('Insufficient USDFC', `You need at least ${LISTING_FEE} USDFC to list a car.`);
      return;
    }
    if (!usdfcApproved) {
      Alert.alert('Approval Required', 'Please approve USDFC before listing.');
      return;
    }
    // Check wallet connection
    if (!isConnected) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet to create a listing');
      return;
    }
    
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
      // 1. Upload images to Web3.Storage
      Alert.alert('Uploading', 'Uploading images to Web3.Storage...');
      const imageCids = [];
      for (let i = 0; i < images.length; i++) {
        const cid = await uploadToWeb3StorageHTTP(images[i], `car-image-${i}.png`, 'image/png');
        imageCids.push(cid);
      }
      // 2. Upload documents to Web3.Storage
      let insuranceCid = '';
      let registrationCid = '';
      if (insuranceDoc) {
        Alert.alert('Uploading', 'Uploading insurance document...');
        insuranceCid = await uploadToWeb3StorageHTTP(insuranceDoc.uri, insuranceDoc.name, 'application/pdf');
      }
      if (registrationDoc) {
        Alert.alert('Uploading', 'Uploading registration document...');
        registrationCid = await uploadToWeb3StorageHTTP(registrationDoc.uri, registrationDoc.name, 'application/pdf');
      }
      // 3. Create metadata JSON
      const metadata = {
        name: `${carData.make} ${carData.model} ${carData.year}`,
        description: carData.description,
        image: `ipfs://${imageCids[0]}`,
        attributes: [
          { trait_type: 'Make', value: carData.make },
          { trait_type: 'Model', value: carData.model },
          { trait_type: 'Year', value: carData.year },
          { trait_type: 'PricePerDay', value: carData.pricePerDay },
        ],
        documents: [
          insuranceDoc ? { type: 'Insurance', url: `ipfs://${insuranceCid}` } : null,
          registrationDoc ? { type: 'Registration', url: `ipfs://${registrationCid}` } : null,
        ].filter(Boolean),
        location: carData.location,
        images: imageCids.map(cid => `ipfs://${cid}`),
      };
      // 4. Upload metadata to Web3.Storage
      Alert.alert('Uploading', 'Uploading metadata to Web3.Storage...');
      const metadataCid = await uploadMetadataHTTP(metadata);
      // 5. Mint NFT via contract
      Alert.alert('Minting NFT', 'Minting NFT on Filecoin...');
      const receipt = await mintNFT(metadataCid);
      setLoading(false);
      
      // Show success and automatically redirect to marketplace
      Alert.alert(
        '🎉 Listing Created Successfully!', 
        `Your car NFT has been minted on Filecoin!\n\n` +
        `📋 Transaction Hash: ${receipt.transactionHash}\n` +
        `🔗 Metadata: ipfs://${metadataCid}\n` +
        `💰 NFT ID: #1\n\n` +
        `Redirecting you to the marketplace to see your listing...`,
        [
          { 
            text: 'View Marketplace', 
            onPress: () => router.push('/marketplace') 
          }
        ]
      );
      
      // Create the new car listing object
      const newCar = {
        id: `car-${Date.now()}`, // Generate unique ID
        name: `${carData.make} ${carData.model} ${carData.year}`,
        make: carData.make,
        model: carData.model,
        year: carData.year,
        pricePerDay: carData.pricePerDay,
        location: carData.location.address,
        image: images[0] || 'https://api.a0.dev/assets/image?text=Car&aspect=16:9',
        nftId: '#1',
        owner: address?.slice(0, 6) + '...' + address?.slice(-4) || 'Unknown',
        isAvailable: true,
        description: carData.description,
        images: images,
        metadataCid: metadataCid,
        transactionHash: receipt.transactionHash
      };

      // Add the new car to the context
      addCar(newCar);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push('/marketplace');
      }, 3000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create listing or mint NFT. Please try again.');
      console.error(error);
    }
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
          <Text style={styles.title}>List Your Car</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Wallet Connection Section */}
          <GlassCard style={styles.cardContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Wallet Connection</Text>
              {!isConnected ? (
                <View>
                  <Text style={styles.sectionDescription}>
                    Connect your wallet to mint NFTs and interact with the blockchain
                  </Text>
                  <GradientButton 
                    onPress={connect} 
                    disabled={walletLoading}
                    style={{ marginTop: 8 }}
                  >
                    {walletLoading ? <ActivityIndicator color="#fff" /> : 'Connect Wallet'}
                  </GradientButton>
                </View>
              ) : (
                <View>
                  <Text style={styles.sectionDescription}>
                    Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.disconnectButton}
                    onPress={disconnect}
                  >
                    <Text style={styles.disconnectButtonText}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </GlassCard>

          <GlassCard style={styles.cardContainer}>
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
                    <Ionicons name="add" size={40} color="#4facfe" />
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
                placeholderTextColor="#b0b0b0"
              />

              <Text style={styles.inputLabel}>Model *</Text>
              <TextInput
                style={styles.input}
                value={carData.model}
                onChangeText={(text) => handleInputChange('model', text)}
                placeholder="e.g. Camry"
                placeholderTextColor="#b0b0b0"
              />

              <Text style={styles.inputLabel}>Year *</Text>
              <TextInput
                style={styles.input}
                value={carData.year}
                onChangeText={(text) => handleInputChange('year', text)}
                placeholder="e.g. 2020"
                keyboardType="number-pad"
                placeholderTextColor="#b0b0b0"
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
                placeholderTextColor="#b0b0b0"
              />

              <Text style={styles.inputLabel}>Price Per Day (USD) *</Text>
              <TextInput
                style={styles.input}
                value={carData.pricePerDay}
                onChangeText={(text) => handleInputChange('pricePerDay', text)}
                placeholder="e.g. 45"
                keyboardType="number-pad"
                placeholderTextColor="#b0b0b0"
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
                style={[styles.documentButton, insuranceDoc && { backgroundColor: '#34a853', borderColor: '#34a853' }]}
                onPress={() => uploadDocument('Insurance')}
              >
                <Ionicons name="document-text-outline" size={24} color="#4facfe" />
                <Text style={[styles.documentButtonText, insuranceDoc && { color: '#fff' }]}>Upload Insurance</Text>
                <Ionicons name="chevron-forward" size={24} color="#5f6368" />
              </TouchableOpacity>

              {insuranceDoc && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginBottom: 4 }}>
                  <Ionicons name="document" size={18} color="#34a853" />
                  <Text style={{ marginLeft: 8, color: '#34a853', fontSize: 14 }}>{insuranceDoc.name}</Text>
                </View>
              )}

              <TouchableOpacity 
                style={[styles.documentButton, registrationDoc && { backgroundColor: '#34a853', borderColor: '#34a853' }]}
                onPress={() => uploadDocument('Registration')}
              >
                <Ionicons name="card-outline" size={24} color="#4facfe" />
                <Text style={[styles.documentButtonText, registrationDoc && { color: '#fff' }]}>Upload Registration</Text>
                <Ionicons name="chevron-forward" size={24} color="#5f6368" />
              </TouchableOpacity>

              {registrationDoc && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginBottom: 4 }}>
                  <Ionicons name="document" size={18} color="#34a853" />
                  <Text style={{ marginLeft: 8, color: '#34a853', fontSize: 14 }}>{registrationDoc.name}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Listing Fee</Text>
              <Text style={styles.sectionDescription}>You must pay a one-time storage fee of {LISTING_FEE} USDFC to list your car.</Text>
              <Text style={styles.sectionDescription}>Your USDFC Balance: {DEMO_USDFC_BALANCE}</Text>
              {!usdfcApproved && (
                <GradientButton onPress={handleApproveUSDFC} style={{ marginTop: 8 }}>
                  Approve USDFC
                </GradientButton>
              )}
              {usdfcApproved && <Text style={{ color: 'green', marginTop: 8 }}>USDFC Approved!</Text>}
            </View>

            <GradientButton onPress={handleSubmit} disabled={loading} style={{ margin: 16 }}>
              {loading ? <ActivityIndicator color="#fff" /> : 'Create Listing'}
            </GradientButton>
          </GlassCard>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
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
    marginBottom: 16,
    color: '#222',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageScrollView: {
    marginBottom: 16,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  carImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 120,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4facfe',
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 12,
    color: '#4facfe',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#202124',
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4facfe',
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
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
  disconnectButton: {
    backgroundColor: '#ff5252',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disconnectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});