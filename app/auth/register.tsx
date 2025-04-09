import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import axios from 'axios';


export default function RegisterScreen() {
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push('8 caractères minimum');
    if (!hasUpperCase) errors.push('une majuscule');
    if (!hasLowerCase) errors.push('une minuscule');
    if (!hasNumbers) errors.push('un chiffre');
    if (!hasSpecialChar) errors.push('un caractère spécial');

    return errors;
  };

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};
  
    if (!nom.trim()) newErrors.nom = 'Le nom est requis';
    else if (nom.length < 2) newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
  
    if (!prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    else if (prenom.length < 2) newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
  
    if (!email) newErrors.email = 'L\'email est requis';
    else if (!validateEmail(email)) newErrors.email = 'Format d\'email invalide';
  
    if (!motDePasse) newErrors.motDePasse = 'Le mot de passe est requis';
    else {
      const passwordErrors = validatePassword(motDePasse);
      if (passwordErrors.length > 0) {
        newErrors.motDePasse = `Le mot de passe doit contenir : ${passwordErrors.join(', ')}`;
      }
    }
  
    if (!confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    else if (motDePasse !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
  
    if (!role) newErrors.role = 'Le rôle est requis';
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('http://10.255.206.167/reservation-app/api/register.php', {
          nom,
          prenom,
          email,
          motDePasse,
          role,
        });
  
        if (response.data.success) {
          Alert.alert('Succès', response.data.message || 'Inscription réussie');
          router.replace("./login");
        } else {
          Alert.alert('Erreur', response.data.message || 'Une erreur est survenue');
        }
      } catch (error) {
        Alert.alert('Erreur', "Impossible d'envoyer les données. Vérifie la connexion ou le serveur.");
        console.error(error);
      }
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            {/* Bouton retour */}
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.returnIcon}>
              <ArrowLeft color="#1e40af" size={26} />
            </TouchableOpacity>

            <Text style={styles.title}>Inscription</Text>

            {/* Formulaire... (inchangé) */}
            {/* ... Tous les inputGroup ici ... */}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                placeholder="Entrez votre nom"
                style={[styles.input, errors.nom && styles.errorInput]}
                value={nom}
                onChangeText={setNom}
                placeholderTextColor="#666"
              />
              {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                placeholder="Entrez votre prénom"
                style={[styles.input, errors.prenom && styles.errorInput]}
                value={prenom}
                onChangeText={setPrenom}
                placeholderTextColor="#666"
              />
              {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Entrez votre email"
                style={[styles.input, errors.email && styles.errorInput]}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Entrez un mot de passe"
                  style={[styles.passwordInput, errors.motDePasse && styles.errorInput]}
                  secureTextEntry={!showPassword}
                  value={motDePasse}
                  onChangeText={setMotDePasse}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={24} color="#666" /> : <EyeOff size={24} color="#666" />}
                </TouchableOpacity>
              </View>
              {errors.motDePasse && <Text style={styles.errorText}>{errors.motDePasse}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirmez le mot de passe"
                  style={[styles.passwordInput, errors.confirmPassword && styles.errorInput]}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <Eye size={24} color="#666" /> : <EyeOff size={24} color="#666" />}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rôle</Text>
              <View style={[styles.pickerWrapper, errors.role && styles.errorInput]}>
                <Picker
                  selectedValue={role}
                  onValueChange={(value) => setRole(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionnez un rôle" value="" color="#666" />
                  <Picker.Item label="Étudiant" value="etudiant" color="#000" />
                  <Picker.Item label="Professeur" value="professeur" color="#000" />
                  <Picker.Item label="Administrateur" value="admin" color="#000" />
                </Picker>
              </View>
              {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  returnIcon: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1e40af',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1e40af',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    padding: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    padding: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  errorInput: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
