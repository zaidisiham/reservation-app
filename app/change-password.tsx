import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [oldPasswordVisible, setOldPasswordVisible] = useState<boolean>(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

  // Fonction pour changer le mot de passe
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);

        // Appel API pour vérifier et mettre à jour le mot de passe
        const response = await fetch('http://192.168.1.69/reservation-app/api/get_change-password.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email, // envoi de l'email de l'utilisateur
            ancienMotDePasse: oldPassword,
            nouveauMotDePasse: newPassword,
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          Alert.alert('Succès', 'Le mot de passe a été mis à jour.');
          router.push('/profile');  // Redirection vers le profil après la modification
        } else {
          Alert.alert('Erreur', result.message || 'Échec de la mise à jour du mot de passe.');
        }
      } else {
        Alert.alert('Erreur', 'Utilisateur introuvable.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error);
      Alert.alert('Erreur', 'Échec de la mise à jour du mot de passe.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Changer le Mot de Passe</Text>

      {/* Ancien mot de passe */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ancien mot de passe"
          secureTextEntry={!oldPasswordVisible}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)} style={styles.eyeIcon}>
          <Icon name={oldPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Nouveau mot de passe */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          secureTextEntry={!newPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)} style={styles.eyeIcon}>
          <Icon name={newPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Confirmer le mot de passe */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmer le nouveau mot de passe"
          secureTextEntry={!confirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
          <Icon name={confirmPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
        <Text style={styles.saveButtonText}>Changer le mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
