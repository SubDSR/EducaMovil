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

const Stack = createStackNavigator();
// 2. Usamos el nuevo navegador
const Tab = createMaterialTopTabNavigator();

// --- El nuevo navegador con pestañas que soporta gestos ---
function MainAppTabs() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom" // Mueve las pestañas a la parte inferior
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#CDB6F8',
        tabBarStyle: {
          backgroundColor: '#52328C',
          height: 80,
          justifyContent: 'center', // Centra verticalmente el contenido
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -4, // Ajusta la posición del texto
          textTransform: 'capitalize', // Evita que el texto se ponga en mayúsculas
        },
        // Estilo de la barra indicadora que se animará al deslizar
        tabBarIndicatorStyle: {
          backgroundColor: '#1F064D', // El color que antes era el fondo
          height: '100%', // Ocupa todo el alto, creando el efecto de "fondo activo"
        },
        swipeEnabled: true, // Habilita el gesto de deslizar
      }}
    >
      <Tab.Screen
        name="Aprende"
        component={CursosScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Logros"
        component={LogrosScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// --- El Stack Navigator no cambia ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}