import { router } from "expo-router";
import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,TouchableWithoutFeedback,Keyboard ,ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../../context/authContext";
import { useSnippets } from "../../context/snippetContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY_BASE = '@SnippetKrblt_ChatHistory';

export default function HomeScreen() {
  const { user ,isLoading} = useAuth();
const {snippets} = useSnippets();
const userId = user?.id || user?._id || 'anonymous';
    
    const [savedMessageCount, setSavedMessageCount] = useState(0);
    const [loadingCount, setLoadingCount] = useState(true); 
    const fetchMessageCount = async () => {
        const DYNAMIC_STORAGE_KEY = `${STORAGE_KEY_BASE}_${userId}`;
        setLoadingCount(true);
        try {
            const storedHistory = await AsyncStorage.getItem(DYNAMIC_STORAGE_KEY);
            if (storedHistory !== null) {
                const parsedHistory = JSON.parse(storedHistory);
                setSavedMessageCount(parsedHistory.length);
            } else {
                setSavedMessageCount(0);
            }
        } catch (error) {
            console.error("AsyncStorage Okuma Hatası (Index):", error);
        } finally {
            setLoadingCount(false);
        }
    };

    useEffect(() => {
        fetchMessageCount();
    }, [userId]); 

    const savedConversationCount = Math.floor(savedMessageCount / 2);
    if (loadingCount) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0aff9d" />
            </View>
        );
    }
  return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hoş geldin,</Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} >
             <Ionicons name="log-out-outline" size={20} color="white" onPress={()=>router.push("/login")}/>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#1A1A1A' }]}>
            <Text style={styles.statNumber}>{snippets.length}</Text>
            <Text style={styles.statLabel}>Snippets</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#00e676' }]}>
            <Text style={[styles.statNumber, {color:'black'}]}>{savedConversationCount}</Text>
            <Text style={[styles.statLabel, {color:'black'}]}>Sorular</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Hızlı Erişim</Text>

        <TouchableOpacity style={styles.actionCard}onPress={()=>{router.replace("addSnippetScreen")}}>
          <View style={styles.iconBox}>
            <Ionicons name="code-slash" size={24} color="#00e676" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Yeni Kod Ekle</Text>
            <Text style={styles.cardDesc}>Proje parçalarını sakla.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#555" style={{marginLeft: 'auto'}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}onPress={()=>{router.replace("chat")}}>
          <View style={styles.iconBox}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#00e676" />
          </View>
          <View>
            <Text style={styles.cardTitle}>AI Chat</Text>
            <Text style={styles.cardDesc}>Hataları yapay zekaya sor.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#555" style={{marginLeft: 'auto'}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}onPress={()=>{router.replace("listeler")}}>
          <View style={styles.iconBox}>
            <Ionicons name="list" size={24} color="#00e676" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Listeler</Text>
            <Text style={styles.cardDesc}>Kaydettiğiniz snippetler</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#555" style={{marginLeft: 'auto'}} />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greeting: { color: '#888', fontSize: 16 },
  username: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  profileBtn: { backgroundColor: '#333', padding: 10, borderRadius: 50 },

  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: { 
    flex: 1, 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  statLabel: { fontSize: 14, color: '#888', marginTop: 5 },

  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  actionCard: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2C2C2E'
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cardDesc: { color: '#666', fontSize: 13, marginTop: 2 }
});