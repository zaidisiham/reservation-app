import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { ChevronRight, Home, Calendar, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Composants de pages
import Reservations from './reservations';
import Profil from './profile';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('accueil');

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Section Hero */}
            <View style={styles.heroContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' }}
                style={styles.heroImage}
              />
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Bienvenue sur ReservApp</Text>
                <Text style={styles.heroSubtitle}>Réservez vos salles et équipements facilement</Text>
              </View>
            </View>

            {/* Actions rapides */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actions rapides</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => router.push('/salles')}
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop' }}
                    style={styles.actionImage}
                  />
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>Salles</Text>
                    <Text style={styles.actionSubtitle}>Voir les salles disponibles</Text>
                  </View>
                  <ChevronRight size={20} color="#6b7280" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => router.push('/equipements_reservation')}
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop' }}
                    style={styles.actionImage}
                  />
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>Équipements</Text>
                    <Text style={styles.actionSubtitle}>Voir les équipements disponibles</Text>
                  </View>
                  <ChevronRight size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
      case 'reservations':
        return <Reservations />;
      case 'profil':
        return <Profil />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Menu bas */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('accueil')} style={styles.tabButton}>
          <Home size={24} color={activeTab === 'accueil' ? '#2563eb' : '#6b7280'} />
          <Text style={activeTab === 'accueil' ? styles.active : styles.inactive}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('reservations')} style={styles.tabButton}>
          <Calendar size={24} color={activeTab === 'reservations' ? '#2563eb' : '#6b7280'} />
          <Text style={activeTab === 'reservations' ? styles.active : styles.inactive}>Réservations</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('profil')} style={styles.tabButton}>
          <User size={24} color={activeTab === 'profil' ? '#2563eb' : '#6b7280'} />
          <Text style={activeTab === 'profil' ? styles.active : styles.inactive}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  heroContainer: {
    height: 200,
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#f0f9ff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
  },
  quickActions: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
