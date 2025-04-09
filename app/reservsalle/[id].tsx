import React, { useEffect, useState } from 'react';
import {
 View,
 Text,
 StyleSheet,
 TouchableOpacity,
 Platform,
 SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Calendar } from 'lucide-react-native';
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
     .get(`http://10.255.205.189/reservation-app/api/salle.php?id=${id}`)
     .then((res) => setSalle(res.data))
     .catch((err) => console.error('Erreur chargement salle :', err));
 }, [id]);
 const onReserver = () => {
   if (!salle) return;
   const data = {
     utilisateur_id: 1,
     salle_id: salle.id,
     date_debut: dateDebut.toISOString().slice(0, 19).replace('T', ' '),
     date_fin: dateFin.toISOString().slice(0, 19).replace('T', ' ')
   };
   axios
     .post('http://10.255.205.189/reservation-app/api/reserve.php', data)
     .then((res) => {
       if (res.data.success) {
         alert("✅ Réservation confirmée");
         router.back();
       } else {
         alert("❌ Erreur : " + res.data.message);
       }
     })
     .catch((err) => {
       console.error(err);
       alert("❌ Erreur de serveur");
     });
 };
 if (!salle) return <Text style={styles.loading}>Chargement...</Text>;
 return (
<SafeAreaView style={styles.container}>
<Text style={styles.title}>Réserver {salle.nom}</Text>
<View style={styles.pickerSection}>
<View style={styles.labelRow}>
<Calendar size={18} color="#1e40af" />
<Text style={styles.label}> Date et heure de début</Text>
</View>
<TouchableOpacity onPress={() => setShowDebut(true)}>
<Text style={styles.dateText}>
           {dateDebut.toLocaleString('fr-FR')}
</Text>
</TouchableOpacity>
       {showDebut && (
<View style={styles.pickerWrapper}>
<DateTimePicker
             value={dateDebut}
             mode="datetime"
             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
             themeVariant="light"
             onChange={(event, selectedDate) => {
               setShowDebut(false);
               if (selectedDate) setDateDebut(selectedDate);
             }}
           />
</View>
       )}
</View>
<View style={styles.pickerSection}>
<View style={styles.labelRow}>
<Calendar size={18} color="#1e40af" />
<Text style={styles.label}> Date et heure de fin</Text>
</View>
<TouchableOpacity onPress={() => setShowFin(true)}>
<Text style={styles.dateText}>
           {dateFin.toLocaleString('fr-FR')}
</Text>
</TouchableOpacity>
       {showFin && (
<View style={styles.pickerWrapper}>
<DateTimePicker
             value={dateFin}
             mode="datetime"
             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
             themeVariant="light"
             onChange={(event, selectedDate) => {
               setShowFin(false);
               if (selectedDate) setDateFin(selectedDate);
             }}
           />
</View>
       )}
</View>
<TouchableOpacity style={styles.button} onPress={onReserver}>
<Text style={styles.buttonText}>Confirmer la réservation</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => router.back()}>
<Text style={styles.cancelText}>Annuler la réservation</Text>
</TouchableOpacity>
</SafeAreaView>
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
   textAlign: 'center',
 },
 pickerSection: {
   marginBottom: 20,
 },
 labelRow: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 4,
 },
 label: {
   fontWeight: 'bold',
   color: '#1e293b',
   marginLeft: 4,
 },
 dateText: {
   fontSize: 16,
   color: '#2563eb',
   marginTop: 4,
   marginBottom: 10,
   marginLeft: 28,
 },
 pickerWrapper: {
   backgroundColor: '#fff',
   borderRadius: 10,
   padding: 10,
 },
 button: {
   backgroundColor: '#1e40af',
   paddingVertical: 14,
   borderRadius: 10,
   marginTop: 20,
 },
 buttonText: {
   color: '#fff',
   textAlign: 'center',
   fontWeight: 'bold',
   fontSize: 16,
 },
 cancelText: {
   marginTop: 16,
   textAlign: 'center',
   color: '#9ca3af',
   fontWeight: 'bold',
 },
 loading: {
   padding: 30,
   textAlign: 'center',
   fontSize: 16,
 },
});