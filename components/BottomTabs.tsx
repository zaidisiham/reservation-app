// components/BottomTabs.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, Calendar, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BottomTabs({ active }: { active: string }) {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => router.push('/home')} style={styles.tabButton}>
        <Home size={24} color={active === 'accueil' ? '#2563eb' : '#6b7280'} />
        <Text style={active === 'accueil' ? styles.active : styles.inactive}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/reservations')} style={styles.tabButton}>
        <Calendar size={24} color={active === 'reservations' ? '#2563eb' : '#6b7280'} />
        <Text style={active === 'reservations' ? styles.active : styles.inactive}>Réservations</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/profile')} style={styles.tabButton}>
        <User size={24} color={active === 'profil' ? '#2563eb' : '#6b7280'} />
        <Text style={active === 'profil' ? styles.active : styles.inactive}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
