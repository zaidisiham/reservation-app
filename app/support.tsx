import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Mail } from 'lucide-react-native';

const SupportScreen = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Ajout d'un état pour l'indicateur de chargement

  const handleSubmit = () => {
    if (message.trim()) {
      setLoading(true); // Affiche l'indicateur de chargement
      setTimeout(() => {
        // Simule un délai d'envoi (ici 2 secondes)
        setLoading(false); // Masque l'indicateur après l'envoi
        Alert.alert("Message envoyé", "Nous avons bien reçu votre message. Nous reviendrons vers vous sous peu.");
        setMessage(''); // Réinitialise le champ du message
      }, 2000);
    } else {
      Alert.alert("Erreur", "Veuillez entrer un message avant de soumettre.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Support</Text>

      <Text style={styles.description}>Si vous avez besoin d'aide, veuillez nous envoyer un message. Nous reviendrons vers vous dès que possible.</Text>

      <TextInput
        style={styles.input}
        placeholder="Écrivez votre message..."
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Mail color="#fff" size={20} />
        )}
        <Text style={styles.submitButtonText}>{loading ? 'Envoi en cours...' : 'Envoyer le message'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#3498db',
    borderWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default SupportScreen;