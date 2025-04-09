import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

interface Salle {
  id: number;
  nom: string;
  localisation: string;
  capacite: number;
  disponibilite: number;
  type: string;
  equipements: string[];
}

export default function ReservationPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [salle, setSalle] = useState<Salle | null>(null);
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showDebut, setShowDebut] = useState(false);
  const [showFin, setShowFin] = useState(false);

  useEffect(() => {
    axios
      .get(`http://192.168.2.15/reservation-app/api/salle.php?id=${id}`)
      .then((res) => {
        console.log("✅ Salle reçue :", res.data);
        setSalle(res.data);
      })
      .catch((err) => console.error('Erreur chargement salle :', err));
  }, [id]);

  const onReserver = () => {
    if (!dateDebut || !dateFin || !salle || !salle.id) {
      Alert.alert('Erreur', 'Les données de la salle ne sont pas chargées.');
      return;
    }

    const data = {
      utilisateur_id: 1,
      salle_id: salle.id,
      date_debut: dateDebut.toISOString().slice(0, 19).replace('T', ' '),
      date_fin: dateFin.toISOString().slice(0, 19).replace('T', ' ')
    };

    console.log("✅ Données envoyées :", data);

    axios
      .post('http://192.168.2.15/reservation-app/api/reserve.php', data)
      .then((res) => {
        if (res.data.success) {
          Alert.alert('✅ Réservation confirmée', res.data.message);
          router.back();
        } else {
          Alert.alert('❌ Erreur', res.data.message || 'Impossible de réserver.');
        }
      })
      .catch((err) => {
        console.error('Erreur Axios :', err);
        if (err.response?.data?.message) {
          Alert.alert('❌ Erreur', err.response.data.message);
        } else {
          Alert.alert('❌ Erreur', 'Erreur de connexion au serveur.');
        }
      });
  };

  if (!salle) return <Text style={styles.loading}>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réserver {salle.nom}</Text>

      <Text style={styles.label}>📅 Date et heure de début</Text>
      <Button
        title={dateDebut.toLocaleString()}
        onPress={() => setShowDebut(true)}
        color="#2563eb"
      />
      {showDebut && (
        <DateTimePicker
          value={dateDebut}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDebut(false);
            if (selectedDate) setDateDebut(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>📅 Date et heure de fin</Text>
      <Button
        title={dateFin.toLocaleString()}
        onPress={() => setShowFin(true)}
        color="#2563eb"
      />
      {showFin && (
        <DateTimePicker
          value={dateFin}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowFin(false);
            if (selectedDate) setDateFin(selectedDate);
          }}
        />
      )}

      <View style={styles.buttonWrapper}>
        <Button title="Confirmer la réservation" color="#1e40af" onPress={onReserver} />
      </View>

      <View style={styles.cancelWrapper}>
        <Button
          title="Annuler la réservation"
          color="#9ca3af"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f9ff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#334155',
  },
  buttonWrapper: {
    marginTop: 30,
  },
  cancelWrapper: {
    marginTop: 20,
  },
  loading: {
    padding: 20,
    textAlign: 'center',
  },
});

