import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'owner';
  timestamp: string;
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  owner: {
    name: string;
    avatar: string;
  };
}

// Mock data for messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hi there! I\'m interested in renting your car.',
    sender: 'user',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    text: 'Hello! Thanks for your interest. When would you like to rent it?',
    sender: 'owner',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: '3',
    text: 'I\'m looking for next weekend, from Friday to Sunday.',
    sender: 'user',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: '4',
    text: 'That should work! The car is available then.',
    sender: 'owner',
    timestamp: new Date(Date.now() - 3300000).toISOString(),
  },
];

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);
  
  // Get car data from route params
  const car: Car = route.params?.car || {
    id: 'default',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    owner: {
      name: 'John Doe',
      avatar: 'https://api.a0.dev/assets/image?text=JD&aspect=1:1',
    }
  };

  useEffect(() => {
    // In a real app, we would connect to libp2p or a messaging service
    // For demo purposes, we'll just scroll to the bottom of the messages
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate owner response
    setTimeout(() => {
      const responseOptions = [
        "Sure, that sounds good!",
        "Let me check my schedule and get back to you.",
        "Would you like to see more photos of the car?",
        "Do you have any specific questions about the car?",
        "I can offer a discount for longer rentals.",
      ];
      
      const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      
      const ownerResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'owner',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, ownerResponse]);
    }, 1500);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.ownerMessageContainer
      ]}>
        {!isUser && (
          <Image 
            source={{ uri: car.owner.avatar }} 
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.ownerMessageBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a73e8" />
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
          <Ionicons name="information-circle-outline" size={24} color="#1a73e8" />
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#fff" : "#a8c7fa"} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.encryptionNote}>
          <Ionicons name="lock-closed" size={12} color="#5f6368" /> End-to-end encrypted via libp2p
        </Text>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
  },
  infoButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  ownerMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: '#1a73e8',
    borderBottomRightRadius: 4,
  },
  ownerMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  messageText: {
    fontSize: 16,
    color: '#202124',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#5f6368',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
    padding: 12,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1a73e8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#e8f0fe',
  },
  encryptionNote: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
    marginTop: 8,
  },
});