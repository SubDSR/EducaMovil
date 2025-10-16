// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// 1. Importamos el nuevo navegador que soporta swipe
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importa tus pantallas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CursosScreen from './src/screens/CursosScreen';
import LogrosScreen from './src/screens/LogrosScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import TiposDeDatosScreen from './src/screens/TiposDeDatosScreen';

const Stack = createStackNavigator();
// 2. Usamos el nuevo navegador
const Tab = createMaterialTopTabNavigator();

function MainAppTabs({ route }) {
  // Obtenemos el email que pasamos desde la pantalla de bienvenida
  const { userEmail } = route.params;

  return (
    <Tab.Navigator
        // ... (la configuración del Tab.Navigator no cambia)
        tabBarPosition="bottom" 
        screenOptions={{
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#CDB6F8',
            tabBarStyle: {
              backgroundColor: '#52328C',
              height: 80,
              justifyContent: 'center',
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: -4, 
              textTransform: 'capitalize',
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#1F064D',
              height: '100%',
            },
            swipeEnabled: true,
          }}
    >
      <Tab.Screen
        name="Aprende"
        component={CursosScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Logros"
        component={LogrosScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} /> }}
      />
      {/* --- CAMBIO IMPORTANTE AQUÍ --- */}
      {/* Pasamos el email como un parámetro inicial a la pantalla de Perfil */}
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        initialParams={{ email: userEmail }} // <-- AQUÍ PASAMOS EL DATO
        options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// --- El Stack Navigator no cambia ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* ... (Login, Register, Welcome, MainApp no cambian) ... */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />
        
        {/* --- AÑADE ESTA LÍNEA --- */}
        <Stack.Screen 
            name="TiposDeDatos" 
            component={TiposDeDatosScreen} 
            options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}