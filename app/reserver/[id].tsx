import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Home, Calendar, User } from 'lucide-react-native';

export default function ReserverPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [date, setDate] = useState(new Date());
  const [heureDebut, setHeureDebut] = useState(new Date());
  const [heureFin, setHeureFin] = useState(new Date());
  const [pickerTarget, setPickerTarget] = useState<null | 'date' | 'debut' | 'fin'>(null);
  const [disponible, setDisponible] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`http://10.255.214.200/reservation-app/api/get_equipement_by_id.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.nom) setNom(data.nom);
      })
      .catch(() => setNom('Équipement inconnu'));
  }, [id]);

  useEffect(() => {
    if (pickerTarget === null) {
      checkDisponibilite();
    }
  }, [date, heureDebut, heureFin]);

  const formatDateTime = (d: Date, t: Date) => {
    const full = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      t.getHours(),
      t.getMinutes()
    );
    return format(full, 'yyyy-MM-dd HH:mm:ss');
  };

  const checkDisponibilite = async () => {
    const dateDebut = formatDateTime(date, heureDebut);
    const dateFin = formatDateTime(date, heureFin);

    try {
      const res = await fetch(
        `http://10.255.214.200/reservation-app/api/check_disponibilite.php?equipement_id=${id}&date_debut=${dateDebut}&date_fin=${dateFin}`
      );
      const data = await res.json();
      setDisponible(data.disponible === true || data.disponible === 'true');
    } catch (err) {
      setDisponible(null);
    }
  };

  const confirmerReservation = async () => {
    const dateDebut = formatDateTime(date, heureDebut);
    const dateFin = formatDateTime(date, heureFin);

    try {
      const res = await fetch('http://10.255.214.200/reservation-app/api/reserver_equipement.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateur_id: 1, // ← à changer si tu as un login
          equipement_id: id,
          date_debut: dateDebut,
          date_fin: dateFin,
        }),
      });
      

      const data = await res.json();
      if (data.success) {
        Alert.alert('Succès', 'Réservation confirmée');
        router.push('/home');
      } else {
        Alert.alert('Erreur', data.message || 'Echec de la réservation');
      }
    } catch (err) {
      Alert.alert('Erreur', "Une erreur s'est produite.");
    }
  };

  const infosChoisies = () => {
    return (
      date &&
      heureDebut &&
      heureFin &&
      format(heureFin, 'HHmm') > format(heureDebut, 'HHmm')
    );
  };

  const getButtonStyle = () => ({
    backgroundColor:
      infosChoisies() && disponible === true ? '#2563eb' : '#9ca3af',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  });

  const renderPicker = () => {
    if (!pickerTarget) return null;
    const value =
      pickerTarget === 'date' ? date : pickerTarget === 'debut' ? heureDebut : heureFin;
    const mode = pickerTarget === 'date' ? 'date' : 'time';

    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        onChange={(_event, selected) => {
          if (selected) {
            if (pickerTarget === 'date') setDate(selected);
            if (pickerTarget === 'debut') setHeureDebut(selected);
            if (pickerTarget === 'fin') setHeureFin(selected);
          }
          setPickerTarget(null);
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Réservation : {nom || `#${id}`}</Text>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Date : {format(date, 'dd/MM/yyyy')}</Text>
          <Pressable onPress={() => setPickerTarget('date')} style={styles.choisir}><Text style={styles.choisirText}>Choisir</Text></Pressable>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Heure de début : {format(heureDebut, 'HH:mm')}</Text>
          <Pressable onPress={() => setPickerTarget('debut')} style={styles.choisir}><Text style={styles.choisirText}>Choisir</Text></Pressable>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Heure de fin : {format(heureFin, 'HH:mm')}</Text>
          <Pressable onPress={() => setPickerTarget('fin')} style={styles.choisir}><Text style={styles.choisirText}>Choisir</Text></Pressable>
        </View>

        {renderPicker()}

        {disponible === false && (
          <Text style={styles.notOk}>❌ L'équipement n'est pas disponible pour cette période</Text>
        )}

        <Pressable
          style={getButtonStyle()}
          onPress={confirmerReservation}
          disabled={!infosChoisies() || disponible !== true}
        >
          <Text style={styles.buttonText}>Réserver</Text>
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        <Pressable onPress={() => router.push('/home')} style={styles.tabButton}>
          <Home size={24} color={'#6b7280'} />
          <Text style={styles.inactive}>Accueil</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/reservations')} style={styles.tabButton}>
          <Calendar size={24} color={'#6b7280'} />
          <Text style={styles.inactive}>Réservations</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile')} style={styles.tabButton}>
          <User size={24} color={'#6b7280'} />
          <Text style={styles.inactive}>Profil</Text>
        </Pressable>
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
  fieldRow: {
    backgroundColor: '#dbeafe',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#1e293b',
  },
  choisir: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  choisirText: {
    color: '#1e40af',
    fontWeight: 'bold',
  },
  notOk: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  inactive: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
});
