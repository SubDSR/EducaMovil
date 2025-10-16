// src/screens/LoginScreen.js
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session'; // --- 1. Importa AuthSession ---
import * as Google from 'expo-auth-session/providers/google';
import { useFonts, Oxanium_700Bold } from '@expo-google-fonts/oxanium';
import { Inter_400Regular } from '@expo-google-fonts/inter';

WebBrowser.maybeCompleteAuthSession();

import backgroundImage from '../../assets/img/login-background.png';
import unmsmLogo from '../../assets/img/logo-unmsm.png';
import robotImage from '../../assets/img/robot-1.png';
import googleIcon from '../../assets/img/google-logo.png';

export default function LoginScreen({ navigation }) {
  // --- 2. Forzamos el uso de la URL de redirección correcta ---
  const redirectUri = 'https://auth.expo.io/@subdsr/EducaMovil';
  console.log("Redirect URI forzada:", redirectUri);


  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '427907752921-enn4ar0sqtbo6j4cdgbnq8dkb7oi0l19.apps.googleusercontent.com', // <-- este debe ser el del cliente Web
    androidClientId: '427907752921-btn7l44e5b5cadjihl5kr5hteo5gi7kr.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@subdsr/EducaMovil',
});

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();
      navigation.navigate('Welcome', { email: user.email });
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };

  let [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    // ... el resto de tu JSX no cambia ...
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <Image source={unmsmLogo} style={styles.logo} />
        <View style={styles.container}>
          <Text style={styles.title}>EducaMovil</Text>
          <Text style={styles.subtitle}>
            Convierte cada línea de código en un paso hacia tu futuro. Inspírate, diviértete y descubre tu camino
          </Text>
          <Image source={robotImage} style={styles.robotImage} />
          <TouchableOpacity
            style={styles.googleBtn}
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          >
            <Image source={googleIcon} style={styles.googleIcon} />
            <Text style={styles.btnText}>Continuar con Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerBtn}>Crear una cuenta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ... tus estilos no cambian ...
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  logo: {
    width: 50,
    height: 60,
    position: 'absolute',
    top: 50,
    left: 20,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Oxanium_700Bold',
    fontSize: 58,
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
    width: '80%',
    color: '#555',
    marginBottom: 30,
  },
  robotImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 15,
  },
  btnText: {
    fontWeight: '500',
    color: '#3c4043',
    fontSize: 16,
  },
  registerBtn: {
    color: '#4062ED',
    fontSize: 14,
    fontWeight: '500',
  },
});