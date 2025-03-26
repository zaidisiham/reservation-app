import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/Accueil.png')} // Vérifie bien le nom et l’emplacement
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🎓 Reservation-App</Text>
        <Text style={styles.subtitle}>Bienvenue sur la plateforme de réservation de salles</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push('/register')}>
          <Text style={styles.buttonOutlineText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export const screenOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    margin: 30,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderColor: '#2563eb',
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  buttonOutlineText: {
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
