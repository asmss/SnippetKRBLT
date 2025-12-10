import { router } from "expo-router";
import { Image } from 'expo-image';
import { Platform, StyleSheet,ScrollView,View,Text,TextInput,Button,TouchableOpacity,Keyboard,TouchableWithoutFeedback} from 'react-native';
import React, { useState } from 'react';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useAuth } from "../../context/authContext";
import { useSnippets } from '../../context/snippetContext';
  export default function addSnippetScreen() {
    const [title,setTitle] = useState("")
    const [code,setCode] = useState("")
    const { user, token } = useAuth();
const { setSnippets ,snippets} = useSnippets();
const [fontsLoaded] = useFonts({
  Poppins_400Regular,
  Poppins_700Bold,
});

const handleBosmu =({title,code})=>{
       if(!title || !code){
        Alert.alert("boş bir metin kutusu kalmamalı")
        return false;
       }
       return true;
}
const handleSave = async() =>{
    
  try {
    if(!handleBosmu({title,code})){
      return;
    }
    const res = await fetch("https://snippetkrblt.onrender.com/api/snippets/create",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`

          },
          body: JSON.stringify({
            userId:user._id,
            title,
            code,
          }),
      
    })
   const data = await res.json();
if (res.ok) { 
        
const newSnippet = data.newSnippet || data.snippet || data.Snippets; // Yedekli kontrol

        if (newSnippet) {
            setSnippets(prevSnippets => [newSnippet, ...prevSnippets]); 

            Alert.alert("Başarılı", "Kod parçacığın başarıyla kaydedildi!");
            setTitle("");
            setCode("");
        } else {
             Alert.alert("Hata", data.message || "Kaydetme başarılı, ancak yeni veri Context'e eklenemedi.");
        }
        
    } else {
         Alert.alert("Hata", data.message || "Kaydetme sırasında bilinmeyen bir sorun oluştu.");
    }

  } catch (error) {
        Alert.alert("Hata", "Bir sorun oluştu, tekrar deneyin.",error);

  }


}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Yeni Snippet Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Başlık"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="< >"
        placeholderTextColor="#777"
        value={code}
        onChangeText={setCode}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Icon name="save" size={28} color="#0aff9d" />
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={()=>{router.push("listeler")}}>
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000", 
    paddingTop:100,
    paddingRight:10,
    paddingLeft:10
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0aff9d",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1a1a1a", 
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#0aff9d33", 
  },

  textArea: {
    height: 150,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#0aff9d22",
    borderColor: "#0aff9d",
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#0aff9d",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionCard: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    marginTop:20,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cardDesc: { color: '#666', fontSize: 13, marginTop: 2 }
});

