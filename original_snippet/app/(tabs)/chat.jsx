import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { askAsimGPT } from '../../services/api'; 
import { useAuth } from "../../context/authContext"; 


const STORAGE_KEY_BASE = '@SnippetKrblt_ChatHistory';
const MAX_HISTORY_ITEMS = 50; 

export default function ChatbotScreen() {
  const { user } = useAuth(); 
  const userId = user?.id || user?._id || 'anonymous'; 
  
  const [inputText, setInputText] = useState('');
  const initialMessage = { id: '1', text: 'Merhaba! Ben SnippetKrblt AI. Nasıl yardımcı olabilirim?', sender: 'bot' };
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef(null); 

   const DYNAMIC_STORAGE_KEY = `${STORAGE_KEY_BASE}_${userId}`;


  useEffect(() => {
      const loadHistory = async () => {
          try {
              const storedHistory = await AsyncStorage.getItem(DYNAMIC_STORAGE_KEY);
              
              if (storedHistory !== null) {
                  const parsedHistory = JSON.parse(storedHistory);
                  // Yüklenen geçmişin üzerine başlangıç mesajını ekle
                  setMessages([initialMessage, ...parsedHistory]); 
              } else {
                  // Kullanıcının geçmişi yoksa veya anonimse, sadece başlangıç mesajını göster
                  setMessages([initialMessage]);
              }
          } catch (error) {
              console.error(`AsyncStorage Geçmişi Yükleme Hatası (${userId}):`, error);
          }
      };
      
      // Her userId değiştiğinde loadHistory çalışır
      loadHistory();
  }, [userId]); 


  const sendMessage = async () => { 
    const userMessageText = inputText.trim();
    if (!userMessageText || isLoading) return;

    const userMsg = { id: Date.now().toString(), text: userMessageText, sender: 'user' };
    
    // Geçici olarak kullanıcı mesajını ekle
    const newMessages = [...messages, userMsg]; 
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponseText = await askAsimGPT(userMessageText);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot'
      };
      
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);

       const historyToSave = finalMessages.slice(1).slice(-MAX_HISTORY_ITEMS); 
      await AsyncStorage.setItem(DYNAMIC_STORAGE_KEY, JSON.stringify(historyToSave));


    } catch (error) {
        const errorMsg = { 
            id: (Date.now() + 1).toString(), 
            text: error.message || "Bilinmeyen bir sunucu hatası.", 
            sender: 'bot' 
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsLoading(false); 
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text 
          style={[styles.msgText, item.sender === 'user' ? styles.userText : styles.botText]}
          selectable={true}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant  ➲  {user.username}</Text> 
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      
      {isLoading && (
        <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color="#0aff9d" />
            <Text style={styles.loadingText}>Asistan düşünüyor...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} 
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Bir soru sor..."
            placeholderTextColor="#777"
            value={inputText}
            onChangeText={setInputText}
            editable={!isLoading}
          />
          <TouchableOpacity 
             style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]} 
             onPress={sendMessage} 
             disabled={isLoading}
          >
            <Ionicons name="arrow-up" size={24} color={isLoading ? '#222' : '#0D0D0D'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', 
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    color: '#0aff9d', 
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  bubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: '80%',
  },
  botBubble: {
    backgroundColor: '#1A1A1A',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#0aff9d22',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#eee',
  },
  userText: {
    color: '#0aff9d',
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom:70, 
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: '#222', 
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#0aff9d',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  loadingText: {
    color: '#0aff9d',
    marginLeft: 8,
    fontSize: 14,
  },
  sendBtnDisabled: {
    backgroundColor: '#0aff9d55',
  },
});