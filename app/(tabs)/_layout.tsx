import { Tabs } from 'expo-router';
import { Home, Building2, Package, Calendar, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1e40af',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Bienvenue',
        }}
      />
      <Tabs.Screen
        name="salles"
        options={{
          title: 'Salles',
          tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
          headerTitle: 'Salles disponibles',
        }}
      />
      <Tabs.Screen
        name="equipements"
        options={{
          title: 'Équipements',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
          headerTitle: 'Équipements',
        }}
      />
    </Tabs>
  );
}
