import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'owner';
  timestamp: Date;
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  pricePerDay: string;
  owner: {
    name: string;
    avatar: string;
  };
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Parse car data from params
  const car: Car = params.car ? JSON.parse(params.car as string) : {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    pricePerDay: '45',
    owner: {
      name: 'John Doe',
      avatar: 'https://api.a0.dev/assets/image?text=JD&aspect=1:1'
    }
  };

  useEffect(() => {
    // Initialize with some mock messages
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Hi! I\'m interested in renting your car. Is it still available?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        text: 'Yes, it\'s available! When would you like to pick it up?',
        sender: 'owner',
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        id: '3',
        text: 'I was thinking this weekend. What\'s the process like?',
        sender: 'user',
        timestamp: new Date(Date.now() - 2400000)
      },
      {
        id: '4',
        text: 'Great! We can meet at the location. I\'ll need to see your license and we can sign the rental agreement.',
        sender: 'owner',
        timestamp: new Date(Date.now() - 1800000)
      }
    ];
    setMessages(initialMessages);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate owner response
      setTimeout(() => {
        const responses = [
          'That sounds good!',
          'I\'ll get back to you shortly.',
          'Perfect timing!',
          'Let me check my schedule.',
          'Great choice!'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const ownerMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: 'owner',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, ownerMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.ownerMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.ownerBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.ownerMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {car.owner.name}
            </Text>
            <Text style={styles.headerSubtitle}>
              {car.year} {car.make} {car.model}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#b0b0b0"
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? '#4facfe' : '#b0b0b0'} 
              />
            </TouchableOpacity>
          </GlassCard>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  infoButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  ownerMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4facfe',
    borderBottomRightRadius: 4,
  },
  ownerBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  ownerMessageText: {
    color: '#202124',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 16,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderRadius: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    maxHeight: 100,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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