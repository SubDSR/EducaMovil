import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa las pantallas que has creado
import LoginScreen from './src/screens/LoginScreen';
import CursosScreen from './src/screens/CursosScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Pantalla de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Esto oculta la barra de título en la pantalla de login
        />
        {/* Pantalla de Cursos */}
        <Stack.Screen
          name="Cursos"
          component={CursosScreen}
          options={{ title: 'Mis Cursos' }} // Esto pone un título en la barra superior
        />
        {/* Pantalla de Registro */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}