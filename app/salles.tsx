import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import BottomTabs from '../components/BottomTabs'; // ← importer ton composant

interface Salle {
  id: number;
  nom: string;
  localisation: string;
  capacite: number;
  disponibilite: number;
  type: string;
  equipements: string[];
}

const imagesSalle: Record<string, any> = {
  'Salle Conference A': require('../assets/images/salle_conference_a.jpg'),
  'Salle Etude E': require('../assets/images/salle_etude_e.jpg'),
  'Salle Informatique B': require('../assets/images/salle_informatique_b.jpg'),
  'Salle Reunion C': require('../assets/images/salle_reunion_c.jpg'),
  'Salle Travaux Pratiques': require('../assets/images/salle_travaux_pratiques.jpg'),
};

export default function SallePage() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get('http://192.168.1.69/reservation-app/api/salles.php')
      .then((res) => setSalles(res.data))
      .catch((err) => console.error('Erreur chargement salles :', err));
  }, []);

  const renderSalle = ({ item }: { item: Salle }) => {
    const image = imagesSalle[item.nom];

    return (
      <View style={styles.card}>
        {image && <Image source={image} style={styles.image} />}
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.detail}>📍 {item.localisation}</Text>
        <Text style={styles.detail}>👥 Capacité : {item.capacite}</Text>
        <Text style={styles.detail}>🏷️ Type : {item.type}</Text>
        <Text style={styles.detail}>🔌 Équipements : {item.equipements.join(', ')}</Text>
        <Text style={styles.dispo}>
          {item.disponibilite === 1 ? '✅ Disponible' : '❌ Non disponible'}
        </Text>

        <TouchableOpacity
          style={[styles.button, item.disponibilite === 0 && styles.disabledButton]}
          onPress={() => {
            if (item.disponibilite === 1) {
              router.push({
                pathname: '/reservsalle/[id]',
                params: { id: item.id.toString() },
              });
            }
          }}
          disabled={item.disponibilite === 0}
        >
          <Text style={styles.buttonText}>
            {item.disponibilite === 1 ? 'Réserver' : 'Indisponible'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>🧾 Salles Disponibles</Text>
        <FlatList
          data={salles}
          renderItem={renderSalle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 🔽 Ajout du menu bas */}
      <BottomTabs active="" />
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  nom: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
    color: '#334155',
  },
  dispo: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
