import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Calendar, User } from 'lucide-react-native';

export default function EquipementsScreen() {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://192.168.1.74/reservation-app/api/get_equipements.php')
      .then(res => res.json())
      .then(data => {
        setEquipements(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur :", error);
        setLoading(false);
      });
  }, []);

  const getImageForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'projecteur':
        return require('../assets/images/epson.jpg');
      case 'micro':
        return require('../assets/images/micro.jpg');
      case 'ordinateur':
        return require('../assets/images/ordinateur.jpg');
      case 'son':
        return require('../assets/images/bluetooth.jpg');
      default:
        return require('../assets/images/favicon.png');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Équipements disponibles</Text>
        <FlatList
          data={equipements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={getImageForType(item.type)}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.nom}</Text>
                <Text style={styles.qte}>Type : {item.type}</Text>
                <Text style={styles.qte}>Quantité : {item.quantite_disponible}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push(`/reserver/${item.id}`)}
                >
                  <Text style={styles.buttonText}>Réserver</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Menu bas personnalisé */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.tabButton}>
          <Home size={24} color={'#6b7280'} />
          <Text style={styles.inactive}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.tabButton}>
          <Calendar size={24} color={'#6b7280'} />
          <Text style={styles.inactive}>Reservation</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.tabButton}>
          <User size={24} color={'#6b7280'} />
          <Text style={styles.inactive}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
  },
  qte: {
    fontSize: 14,
    color: '#6b7280',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  inactive: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
});
