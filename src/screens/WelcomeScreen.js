// src/screens/WelcomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  AccessibilityInfo,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

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

    const firstName = names[0]
      ? names[0].charAt(0).toUpperCase() + names[0].slice(1)
      : 'Usuario';

    const lastName = names[1]
      ? names[1].charAt(0).toUpperCase() + names[1].slice(1)
      : '';

    return { firstName, lastName };
  };

  const { firstName, lastName } = getUserData(email);

  let [fontsLoaded] = useFonts({
    Oxanium_600SemiBold,
    Roboto_500Medium,
  });

  // --- ACCESIBILIDAD ---
  const [screenReaderOn, setScreenReaderOn] = useState(false);

  // Este hook SIEMPRE se llama (para no romper React)
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      setScreenReaderOn(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'change',
      (enabled) => {
        setScreenReaderOn(enabled);
      }
    );

    return () => subscription.remove();
  }, []);

  // Mensaje de bienvenida por VoiceOver / TalkBack
  useEffect(() => {
    if (screenReaderOn) {
      const mensaje = `Hola ${firstName}. Bienvenido a tu perfil.`;
      AccessibilityInfo.announceForAccessibility(mensaje);
    }
  }, [screenReaderOn]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text
          style={styles.greeting}
          accessibilityRole="header"
          accessible={true}
        >
          ¡Hola {firstName}!
        </Text>

        <Image
          source={profileImage}
          style={styles.profileImage}
          accessible={true}
          accessibilityLabel={`Foto de perfil de ${firstName} ${lastName}`}
        />

        <Text
          style={styles.fullName}
          accessible={true}
          accessibilityLabel={`Nombre completo: ${firstName} ${lastName}`}
        >
          {firstName} {lastName}
        </Text>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainApp', params: { userEmail: email } }],
            })
          }
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Continuar al menú principal"
        >
          <Image
            source={nextButton}
            style={styles.nextButtonIcon}
            accessible={false}
          />
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
