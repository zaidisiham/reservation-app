import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  LogOut,
  Mail,
  Shield,
  Lock,
  Edit,
  BookOpen,
  HelpCircle,
  Bell, // <- Ajout de l'icône de notification
} from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Erreur", "Échec de la déconnexion.");
    }
  };

  const handleEditProfile = () => router.push("/edit-profile");
  const handleChangePassword = () => router.push("/change-password");
  const handleViewReservations = () => router.push("/reservations-history");
  const handleSupport = () => router.push("/support");
  const handleNotifications = () => router.push("/notifications"); // <- Fonction pour notifications

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Mon Profil</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : user ? (
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.nom?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user.nom} {user.prenom}
          </Text>
          <InfoRow icon={Mail} text={user.email} />
          <InfoRow icon={Shield} text={user.role} />
        </View>
      ) : (
        <Text style={styles.errorText}>Aucun utilisateur trouvé.</Text>
      )}

      <Text style={styles.sectionTitle}>Actions disponibles</Text>

      <View style={styles.actionsContainer}>
        <ActionButton icon={Bell} label="Mes notifications" onPress={handleNotifications} />
        <ActionButton icon={Edit} label="Modifier le profil" onPress={handleEditProfile} />
        <ActionButton icon={Lock} label="Changer le mot de passe" onPress={handleChangePassword} />
        <ActionButton icon={BookOpen} label="Mon historique réservations" onPress={handleViewReservations} />
        <ActionButton icon={HelpCircle} label="Contacter le support" onPress={handleSupport} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#fff" size={20} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InfoRow = ({ icon: Icon, text }) => (
  <View style={styles.infoRow}>
    <Icon color="#3498db" size={20} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const ActionButton = ({ icon: Icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Icon color="#2c3e50" size={20} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#f9f9f9",
    minHeight: "100%",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 25,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#2c3e50",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  actionsContainer: {
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#2c3e50",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
});
