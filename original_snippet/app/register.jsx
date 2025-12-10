import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/authContext";

export default function Login() {
    const [username,setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useAuth();

  const handleRegister = async () => {
    try {
      const res = await fetch('https://snippetkrblt.onrender.com/api/users/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        Alert.alert("Hata", data.message || "kayıt yapılamadı!");
        return;
      }

      setUser(data.user);
      setToken(data.token);

      Alert.alert("Başarılı", "Kayıt başarılı!");
      router.push("login")

    } catch (error) {
      console.error("Sunucu hatası:", error);
      Alert.alert("Sunucu Hatası", "Sunucuya bağlanılamıyor!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KAYIT SAYFASI</Text>
        <View style={styles.inputWrapper}>
        <Icon name="id-badge" size={20} color="#0aff9d" />
        <TextInput
          placeholder="user name"
          placeholderTextColor="#777"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>
 
      <View style={styles.inputWrapper}>
        <Icon name="envelope" size={20} color="#0aff9d" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="lock" size={20} color="#0aff9d" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Icon name="user-plus" size={24} color="#0aff9d" />
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    
    <TouchableOpacity style={styles.button} onPress={()=>{router.push("login")}}>
        <Icon name="sign-in" size={24} color="#0aff9d" />
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#000", // siyah
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#0aff9d",
    marginBottom: 40,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#0aff9d33",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 18,
    backgroundColor: "#1a1a1a", // koyu gri
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },

  button: {
    backgroundColor: "#0aff9d22",
    borderColor: "#0aff9d",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#0aff9d",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
});
