import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reservation {
  reservation_id: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  salle_nom: string;
  localisation: string;
}

const HistoriqueReservations = () => {
  const [historique, setHistorique] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const id = await AsyncStorage.getItem('utilisateurId');
        if (id) {
          const response = await fetch(`http://192.168.1.69/reservation-app/api/get_reservations.php?utilisateur_id=${id}`);
          const data = await response.json();
          setHistorique(data);
        } else {
          console.warn("Aucun ID utilisateur trouvé.");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const renderReservation = ({ item }: { item: Reservation }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Salle: {item.salle_nom}</Text>
      <Text style={styles.detail}>Localisation: {item.localisation}</Text>
      <Text style={styles.detail}>Début: {item.date_debut}</Text>
      <Text style={styles.detail}>Fin: {item.date_fin}</Text>
      <Text style={[styles.status, item.statut === 'confirmée' ? styles.confirmed : styles.pending]}>
        Statut: {item.statut}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historique des réservations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={historique}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderReservation}
          ListEmptyComponent={<Text>Aucun historique de réservation trouvé.</Text>}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
  },
  detail: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  confirmed: {
    color: '#4caf50',
  },
  pending: {
    color: '#ff9800',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HistoriqueReservations;
