import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const router = useRouter();

  const utilisateurId = 1; // À ajuster dynamiquement si tu gères des comptes utilisateurs

  useEffect(() => {
    fetch(`http://192.168.1.74/reservation-app/api/get_mes_reservations.php?utilisateur_id=${utilisateurId}`)
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(() => Alert.alert('Erreur', 'Impossible de récupérer les réservations'));
  }, []);

  const supprimerReservation = (id) => {
    Alert.alert('Confirmer', 'Supprimer cette réservation ?', [
      { text: 'Annuler' },
      {
        text: 'Supprimer', onPress: async () => {
          try {
            const res = await fetch(`http://192.168.1.74/reservation-app/api/delete_reservation.php?id=${id}`, {
              method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
              setReservations(prev => prev.filter(r => r.id !== id));
            } else {
              Alert.alert('Erreur', data.message || 'Suppression échouée');
            }
          } catch {
            Alert.alert('Erreur', 'Erreur serveur lors de la suppression');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nom}</Text>
      <Text style={styles.detail}>Début : {item.date_debut}</Text>
      <Text style={styles.detail}>Fin : {item.date_fin}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => supprimerReservation(item.id)}>
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Mes Réservations</Text>
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Aucune réservation</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  detail: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  menuButton: {
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    color: '#1e3a8a',
    marginTop: 4,
  },
});
