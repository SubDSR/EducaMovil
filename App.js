// App.js - CON ANIMACIONES SIN SAFE AREA + NAVEGACIÓN BLOQUEADA
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Platform } from 'react-native';

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

// ✅ COMPONENTE DE ICONO ANIMADO CON ANIMATED
const AnimatedTabIcon = ({ name, focused, color, size }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.2 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

// Stack del Tab Aprende
function AprendeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cursos" component={CursosScreen} />
      <Stack.Screen name="TiposDeDatos" component={TiposDeDatosScreen} />
      <Stack.Screen name="LeccionFlashcard" component={LeccionFlashcardScreen} />
      <Stack.Screen name="LeccionQuiz" component={LeccionQuizScreen} />
      {/* ✅ FEEDBACK SIN POSIBILIDAD DE VOLVER */}
      <Stack.Screen 
        name="LeccionFeedback" 
        component={LeccionFeedbackScreen}
        options={{
          gestureEnabled: false, // Deshabilitar gesto de volver
        }}
      />
      <Stack.Screen name="VisualizadorAlgoritmos" component={VisualizadorAlgoritmosScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator principal SIN SAFE AREA
function MainAppTabs({ route }) {
  const { userEmail } = route.params || {};

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#CDB6F8',
        tabBarStyle: {
          backgroundColor: '#52328C',
          // ✅ SIN SAFE AREA - Altura fija según plataforma
          height: Platform.OS === 'android' ? 90 : 100,
          paddingBottom: Platform.OS === 'android' ? 30 : 40,
          paddingTop: Platform.OS === 'android' ? 5 : 15,
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -4,
          textTransform: 'capitalize',
          fontWeight: '600',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#1F064D',
          height: '100%',
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          
          if (route.name === 'Aprende') {
            iconName = 'school';
          } else if (route.name === 'Logros') {
            iconName = 'trophy';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }
          
          // ✅ Usar componente animado
          return <AnimatedTabIcon name={iconName} focused={focused} color={color} size={24} />;
        },
        swipeEnabled: true,
      })}
    >
      <Tab.Screen
        name="Aprende"
        component={AprendeStack}
      />
      <Tab.Screen
        name="Logros"
        component={LogrosScreen}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        initialParams={{ email: userEmail }}
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