import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; motDePasse?: string }>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
  
    if (!email) newErrors.email = 'Email requis';
    else if (!validateEmail(email)) newErrors.email = 'Format d’email invalide';
  
    if (!motDePasse) newErrors.motDePasse = 'Mot de passe requis';
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://192.168.2.23/reservation-app/api/login.php", {
          email,
          motDePasse,
        });
  
        if (response.data?.status === 'success') {
          const user = response.data.user;
  
          // 🔐 Stocker les infos utilisateur localement
          await AsyncStorage.setItem('user', JSON.stringify(user));
  
          Alert.alert("Bienvenue", `${user.prenom} ${user.nom}`);
          router.replace("/home"); // rediriger vers les tabs
        } else {
          Alert.alert("Erreur", response.data.message || "Identifiants incorrects");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Connexion au serveur impossible");
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>

        {/* Retour vers accueil */}
        <TouchableOpacity onPress={() => router.replace("/")} style={styles.returnIcon}>
          <ArrowLeft color="#1e40af" size={26} />
        </TouchableOpacity>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Entrez votre email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputWrapper}>
  <TextInput
    style={[styles.input, errors.motDePasse && styles.errorInput]}
    placeholder="Mot de passe"
    value={motDePasse}
    onChangeText={setMotDePasse}
    secureTextEntry={!showPassword}
    placeholderTextColor="#666"
  />
  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
    {showPassword ? <Eye size={22} color="#666" /> : <EyeOff size={22} color="#666" />}
  </TouchableOpacity>
</View>

          {errors.motDePasse && <Text style={styles.errorText}>{errors.motDePasse}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  returnIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 20,
    left: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#1e40af',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    color: '#000',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
    fontSize: 14,
  },
});
