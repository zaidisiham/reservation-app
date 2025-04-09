import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react-native';

export default function ReservationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes réservations</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réservations à venir</Text>
        
        <TouchableOpacity style={styles.reservationCard}>
          <View style={styles.reservationHeader}>
            <Text style={styles.roomName}>Salle A101</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmé</Text>
            </View>
          </View>

          <View style={styles.reservationDetails}>
            <View style={styles.detailRow}>
              <CalendarIcon size={20} color="#6b7280" />
              <Text style={styles.detailText}>Lundi, 15 Avril 2024</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={20} color="#6b7280" />
              <Text style={styles.detailText}>14:00 - 16:00</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={20} color="#6b7280" />
              <Text style={styles.detailText}>Bâtiment A, 1er étage</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler la réservation</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reservationCard}>
          <View style={styles.reservationHeader}>
            <Text style={styles.roomName}>Salle B202</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmé</Text>
            </View>
          </View>

          <View style={styles.reservationDetails}>
            <View style={styles.detailRow}>
              <CalendarIcon size={20} color="#6b7280" />
              <Text style={styles.detailText}>Mardi, 16 Avril 2024</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={20} color="#6b7280" />
              <Text style={styles.detailText}>10:00 - 12:00</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={20} color="#6b7280" />
              <Text style={styles.detailText}>Bâtiment B, 2ème étage</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler la réservation</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historique</Text>
        
        <TouchableOpacity style={[styles.reservationCard, styles.pastReservation]}>
          <View style={styles.reservationHeader}>
            <Text style={styles.roomName}>Salle C303</Text>
            <View style={[styles.statusBadge, styles.completedBadge]}>
              <Text style={styles.completedStatusText}>Terminé</Text>
            </View>
          </View>

          <View style={styles.reservationDetails}>
            <View style={styles.detailRow}>
              <CalendarIcon size={20} color="#6b7280" />
              <Text style={styles.detailText}>10 Avril 2024</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={20} color="#6b7280" />
              <Text style={styles.detailText}>09:00 - 11:00</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 16,
  },
  reservationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
  },
  statusBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '500',
  },
  reservationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#6b7280',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  pastReservation: {
    opacity: 0.8,
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
  },
  completedStatusText: {
    color: '#059669',
  },
});