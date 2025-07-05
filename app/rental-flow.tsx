import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import {
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

interface RentalDetails {
  carId: string;
  carName: string;
  owner: string;
  pricePerDay: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  deposit: number;
}

export default function RentalFlowScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [rentalDetails, setRentalDetails] = useState<RentalDetails>({
    carId: '1',
    carName: 'Toyota Camry 2020',
    owner: '0x742d35...4d8b6',
    pricePerDay: 45,
    startDate: '',
    endDate: '',
    totalDays: 0,
    totalCost: 0,
    deposit: 200
  });

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    driverLicense: '',
    insuranceInfo: ''
  });

  const calculateRental = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalCost = days * rentalDetails.pricePerDay;
      
      setRentalDetails(prev => ({
        ...prev,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays: days,
        totalCost: totalCost
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!formData.startDate || !formData.endDate)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleConfirmRental = async () => {
    Alert.alert('Processing Rental', 'Initiating blockchain transaction...');
    
    // Simulate blockchain transaction
    setTimeout(() => {
      Alert.alert(
        '🎉 Rental Confirmed!',
        `Your rental has been processed on Filecoin!\n\n` +
        `📋 Transaction Hash: 0x1234...abcd\n` +
        `🚗 Car: ${rentalDetails.carName}\n` +
        `📅 Duration: ${rentalDetails.totalDays} days\n` +
        `💰 Total: $${rentalDetails.totalCost}\n\n` +
        `The car owner will be notified and you can arrange pickup!`,
        [
          {
            text: 'View Rental Details',
            onPress: () => router.push('/rental-details')
          },
          {
            text: 'OK',
            onPress: () => router.push('/')
          }
        ]
      );
    }, 2000);
  };

  const renderStep1 = () => (
    <GlassCard style={styles.stepCard}>
      <Text style={styles.stepTitle}>Step 1: Select Rental Dates</Text>
      
      <View style={styles.carPreview}>
        <Image 
          source={{ uri: 'https://api.a0.dev/assets/image?text=Toyota%20Camry&aspect=16:9' }}
          style={styles.carImage}
        />
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{rentalDetails.carName}</Text>
          <Text style={styles.carPrice}>${rentalDetails.pricePerDay}/day</Text>
          <Text style={styles.carOwner}>Owner: {rentalDetails.owner}</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Start Date</Text>
        <TextInput
          style={styles.textInput}
          placeholder="YYYY-MM-DD"
          value={formData.startDate}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, startDate: text }));
            calculateRental();
          }}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>End Date</Text>
        <TextInput
          style={styles.textInput}
          placeholder="YYYY-MM-DD"
          value={formData.endDate}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, endDate: text }));
            calculateRental();
          }}
        />
      </View>

      {rentalDetails.totalDays > 0 && (
        <View style={styles.calculationCard}>
          <Text style={styles.calculationTitle}>Rental Summary</Text>
          <Text style={styles.calculationText}>
            Duration: {rentalDetails.totalDays} days
          </Text>
          <Text style={styles.calculationText}>
            Daily Rate: ${rentalDetails.pricePerDay}
          </Text>
          <Text style={styles.calculationTotal}>
            Total: ${rentalDetails.totalCost}
          </Text>
        </View>
      )}
    </GlassCard>
  );

  const renderStep2 = () => (
    <GlassCard style={styles.stepCard}>
      <Text style={styles.stepTitle}>Step 2: Pickup & Dropoff</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pickup Location</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter pickup address"
          value={formData.pickupLocation}
          onChangeText={(text) => setFormData(prev => ({ ...prev, pickupLocation: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dropoff Location</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter dropoff address"
          value={formData.dropoffLocation}
          onChangeText={(text) => setFormData(prev => ({ ...prev, dropoffLocation: text }))}
        />
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#4facfe" />
        <Text style={styles.infoText}>
          You'll coordinate pickup details with the car owner after booking confirmation.
        </Text>
      </View>
    </GlassCard>
  );

  const renderStep3 = () => (
    <GlassCard style={styles.stepCard}>
      <Text style={styles.stepTitle}>Step 3: Driver Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Driver License Number</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter license number"
          value={formData.driverLicense}
          onChangeText={(text) => setFormData(prev => ({ ...prev, driverLicense: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Insurance Information</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter insurance details"
          value={formData.insuranceInfo}
          onChangeText={(text) => setFormData(prev => ({ ...prev, insuranceInfo: text }))}
        />
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark" size={20} color="#34a853" />
        <Text style={styles.infoText}>
          Your information is encrypted and stored securely on IPFS.
        </Text>
      </View>
    </GlassCard>
  );

  const renderStep4 = () => (
    <GlassCard style={styles.stepCard}>
      <Text style={styles.stepTitle}>Step 4: Review & Confirm</Text>
      
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Rental Summary</Text>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Car:</Text>
          <Text style={styles.reviewValue}>{rentalDetails.carName}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Duration:</Text>
          <Text style={styles.reviewValue}>{rentalDetails.totalDays} days</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Start Date:</Text>
          <Text style={styles.reviewValue}>{rentalDetails.startDate}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>End Date:</Text>
          <Text style={styles.reviewValue}>{rentalDetails.endDate}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Daily Rate:</Text>
          <Text style={styles.reviewValue}>${rentalDetails.pricePerDay}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Security Deposit:</Text>
          <Text style={styles.reviewValue}>${rentalDetails.deposit}</Text>
        </View>
        
        <View style={[styles.reviewItem, styles.totalItem]}>
          <Text style={styles.totalLabel}>Total Cost:</Text>
          <Text style={styles.totalValue}>${rentalDetails.totalCost + rentalDetails.deposit}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="card" size={20} color="#ff6b35" />
        <Text style={styles.infoText}>
          Payment will be processed through your connected wallet on Filecoin.
        </Text>
      </View>
    </GlassCard>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/marketplace')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Rent Car</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{currentStep}/4</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {renderCurrentStep()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity 
              style={styles.backStepButton}
              onPress={() => setCurrentStep(prev => prev - 1)}
            >
              <Text style={styles.backStepButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 4 ? (
            <TouchableOpacity 
              style={styles.nextStepButton}
              onPress={handleNextStep}
            >
              <Text style={styles.nextStepButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmRental}
            >
              <Text style={styles.confirmButtonText}>Confirm Rental</Text>
            </TouchableOpacity>
          )}
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
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  stepCard: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 20,
  },
  carPreview: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  carImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  carInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 14,
    color: '#34a853',
    fontWeight: '600',
    marginBottom: 4,
  },
  carOwner: {
    fontSize: 12,
    color: '#5f6368',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  calculationCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 12,
  },
  calculationText: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 4,
  },
  calculationTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34a853',
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 8,
    flex: 1,
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#5f6368',
  },
  reviewValue: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '600',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34a853',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  backStepButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  backStepButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  nextStepButton: {
    flex: 1,
    backgroundColor: '#4facfe',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  nextStepButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#34a853',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 