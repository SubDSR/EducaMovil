// App.js - VERSIÓN ACTUALIZADA CON TODAS LAS PANTALLAS
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

// Pantallas de lecciones (Tipos de Datos)
import TiposDeDatosScreen from './src/screens/TiposDeDatosScreen';
import LeccionFlashcardScreen from './src/screens/LeccionFlashcardScreen';
import LeccionQuizScreen from './src/screens/LeccionQuizScreen';
import LeccionFeedbackScreen from './src/screens/LeccionFeedbackScreen';
import VisualizadorAlgoritmosScreen from './src/screens/VisualizadorAlgoritmosScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Navegador de pestañas principales (Bottom Tab)
function MainAppTabs({ route }) {
  const { userEmail } = route.params;

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
        swipeEnabled: true,
      }}
    >
      <Tab.Screen
        name="Aprende"
        component={CursosScreen}
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

// Stack Navigator principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Pantallas de autenticación */}
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
        
        {/* App principal con tabs */}
        <Stack.Screen 
          name="MainApp" 
          component={MainAppTabs} 
          options={{ headerShown: false }} 
        />
        
        {/* Pantallas de cursos y lecciones */}
        <Stack.Screen 
          name="TiposDeDatos" 
          component={TiposDeDatosScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LeccionFlashcard" 
          component={LeccionFlashcardScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LeccionQuiz" 
          component={LeccionQuizScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LeccionFeedback" 
          component={LeccionFeedbackScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VisualizadorAlgoritmos" 
          component={VisualizadorAlgoritmosScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}