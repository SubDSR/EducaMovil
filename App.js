// App.js - SOLUCIÓN ALTERNATIVA: Control individual por pantalla
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

// Pantallas principales
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CursosScreen from './src/screens/CursosScreen';
import LogrosScreen from './src/screens/LogrosScreen';
import PerfilScreen from './src/screens/PerfilScreen';

// Curso: Tipos de Datos
import TiposDeDatosScreen from './src/screens/TiposDeDatosScreen';
import LeccionFlashcardScreen from './src/screens/LeccionFlashcardScreen';
import LeccionQuizScreen from './src/screens/LeccionQuizScreen';
import LeccionFeedbackScreen from './src/screens/LeccionFeedbackScreen';

// Curso: Algoritmos
import VisualizadorAlgoritmosScreen from './src/screens/VisualizadorAlgoritmosScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Stack del Tab Aprende
function AprendeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cursos" component={CursosScreen} />
      <Stack.Screen name="TiposDeDatos" component={TiposDeDatosScreen} />
      <Stack.Screen name="LeccionFlashcard" component={LeccionFlashcardScreen} />
      <Stack.Screen name="LeccionQuiz" component={LeccionQuizScreen} />
      <Stack.Screen name="LeccionFeedback" component={LeccionFeedbackScreen} />
      <Stack.Screen name="VisualizadorAlgoritmos" component={VisualizadorAlgoritmosScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator principal
function MainAppTabs({ route }) {
  const { userEmail } = route.params || {};

  return (
    <Tab.Navigator
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
        swipeEnabled: true, // ✅ Habilitar swipe entre tabs
      }}
    >
      <Tab.Screen
        name="Aprende"
        component={AprendeStack}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />
        }}
      />
      <Tab.Screen
        name="Logros"
        component={LogrosScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        initialParams={{ email: userEmail }}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

// Stack principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainAppTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}