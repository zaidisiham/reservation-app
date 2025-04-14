import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user_id = 1; // Remplace cette ligne par l'id de l'utilisateur que tu veux utiliser

        const response = await fetch(
          `http://192.168.1.69/reservation-app/api/get_notifications.php?utilisateur_id=${user_id}`
        );

        if (!response.ok) {
          console.error("Erreur HTTP:", response.status);
          setNotifications([]); // Si l'API échoue, retourne une liste vide
          return;
        }

        const raw = await response.text();
        console.log("Réponse brute :", raw);

        try {
          const data = JSON.parse(raw);

          if (data.error) {
            console.error("Erreur côté serveur :", data.error);
            setNotifications([]);
          } else if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            console.error("Format inattendu des notifications !");
            setNotifications([]);
          }
        } catch (error) {
          console.error("Erreur de parsing JSON :", error.message);
          setNotifications([]); // Si le parsing échoue, on met une liste vide
        }
      } catch (error) {
        console.error("Erreur de chargement des notifications :", error.message);
        setNotifications([]); // Si la requête échoue, on met une liste vide
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // L'appel est fait une seule fois, lors du premier rendu

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationText}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notificationContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
  },
});
