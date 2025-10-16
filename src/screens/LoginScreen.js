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
import { useFonts, Oxanium_700Bold } from '@expo-google-fonts/oxanium';
import { Inter_400Regular } from '@expo-google-fonts/inter';

// --- Importa tus imágenes desde la carpeta de assets ---
import backgroundImage from '../../assets/img/login-background.png';
import unmsmLogo from '../../assets/img/logo-unmsm.png';
import robotImage from '../../assets/img/robot-1.png';
import googleIcon from '../../assets/img/google-logo.png'; // Asumiendo que guardaste el logo de Google

export default function LoginScreen({ navigation }) {
  // --- Carga las fuentes que necesitas ---
  let [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null; // O un componente de carga mientras las fuentes se cargan
  }

  return (
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
            // Navega a la pantalla de cursos al presionar
            onPress={() => navigation.navigate('Cursos')}
          >
            <Image source={googleIcon} style={styles.googleIcon} />
            <Text style={styles.btnText}>Continuar con Google</Text>
          </TouchableOpacity>

          // En LoginScreen.js, busca este TouchableOpacity y modifícalo:
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerBtn}>Crear una cuenta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// --- Estilos convertidos desde tu CSS ---
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
    top: 50, // Ajusta según sea necesario
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
    color: '#333', // Color ajustado para mejor legibilidad
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
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // Sombra para Android
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