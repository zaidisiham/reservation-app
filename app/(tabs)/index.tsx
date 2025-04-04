import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' }}
          style={styles.heroImage}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Bienvenue sur ReservApp</Text>
          <Text style={styles.heroSubtitle}>
            Réservez facilement vos salles et équipements
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/salles')}
          >
            <View style={styles.actionIconContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop' }}
                style={styles.actionImage}
              />
            </View>
            <Text style={styles.actionTitle}>Salles</Text>
            <Text style={styles.actionSubtitle}>Explorer les salles disponibles</Text>
            <ChevronRight size={20} color="#6b7280" style={styles.actionArrow} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/equipements')}
          >
            <View style={styles.actionIconContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop' }}
                style={styles.actionImage}
              />
            </View>
            <Text style={styles.actionTitle}>Équipements</Text>
            <Text style={styles.actionSubtitle}>Découvrir les équipements</Text>
            <ChevronRight size={20} color="#6b7280" style={styles.actionArrow} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Reservations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Réservations récentes</Text>
          <TouchableOpacity onPress={() => router.push('/reservations')}>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recentReservations}
        >
          <TouchableOpacity style={styles.reservationCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' }}
              style={styles.reservationImage}
            />
            <View style={styles.reservationContent}>
              <Text style={styles.reservationTitle}>Salle A101</Text>
              <Text style={styles.reservationDate}>Aujourd'hui, 14:00 - 16:00</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reservationCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop' }}
              style={styles.reservationImage}
            />
            <View style={styles.reservationContent}>
              <Text style={styles.reservationTitle}>Salle B202</Text>
              <Text style={styles.reservationDate}>Demain, 10:00 - 12:00</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  heroContainer: {
    position: 'relative',
    height: 200,
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
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#f0f9ff',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  actionImage: {
    width: '100%',
    height: '100%',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  actionArrow: {
    marginLeft: 'auto',
  },
  seeAllButton: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  recentReservations: {
    flexDirection: 'row',
  },
  reservationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: 280,
    marginRight: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  reservationImage: {
    width: '100%',
    height: 150,
  },
  reservationContent: {
    padding: 16,
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  reservationDate: {
    fontSize: 14,
    color: '#6b7280',
  },
});