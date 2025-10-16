// src/screens/WelcomeScreen.js
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { useFonts, Oxanium_600SemiBold } from '@expo-google-fonts/oxanium';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';

// --- Importa tus imágenes ---
import backgroundImage from '../../assets/img/perfil1-background.png';
import profileImage from '../../assets/img/perfil1.png';
import nextButton from '../../assets/img/perfil-button.png';

export default function WelcomeScreen({ route, navigation }) {
  const { email } = route.params;

  const getUserData = (userEmail) => {
    if (!userEmail || !userEmail.includes('@')) {
      return { firstName: 'Usuario', lastName: '' };
    }
    const namePart = userEmail.split('@')[0];
    const names = namePart.split('.');

    const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : 'Usuario';
    const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';

    return { firstName, lastName };
  };

  const { firstName, lastName } = getUserData(email);

  let [fontsLoaded] = useFonts({
    Oxanium_600SemiBold,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.greeting}>¡Hola {firstName}!</Text>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.fullName}>{firstName} {lastName}</Text>

        <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('MainApp')} // <-- CAMBIA 'Cursos' por 'MainApp'
        >
            <Image source={nextButton} style={styles.nextButtonIcon} />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: 'Oxanium_600SemiBold',
    fontSize: 38,
    fontWeight: '600',
    marginBottom: 60,
    color: '#333',
  },
  profileImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  fullName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 28,
    fontWeight: '500',
    marginTop: 30,
    color: '#333',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
  },
  nextButtonIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});