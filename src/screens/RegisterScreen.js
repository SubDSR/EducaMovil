// src/screens/RegisterScreen.js
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  TextInput, // Importamos el componente para inputs
} from 'react-native';
import { useFonts, Oxanium_700Bold, Oxanium_600SemiBold } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons'; // Importamos los iconos

// --- Importa tus imágenes ---
import backgroundImage from '../../assets/img/login-background.png';
import unmsmLogo from '../../assets/img/logo-unmsm.png';
import robotImage from '../../assets/img/robot-2.png';
import googleIcon from '../../assets/img/google-logo.png';

export default function RegisterScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Oxanium_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <Image source={unmsmLogo} style={styles.logo} />
        <View style={styles.container}>
          <Text style={styles.title}>EducaMovil</Text>
          <Text style={styles.stepText}>¡Solo falta un paso!</Text>
          <Image source={robotImage} style={styles.robotImage} />

          <Text style={styles.registerLabel}>Registrate</Text>

          {/* --- Campos de entrada --- */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#828282" />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#828282"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#828282" />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#828282"
              secureTextEntry={true} // Oculta el texto de la contraseña
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Cursos')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleBtn}>
            <Image source={googleIcon} style={styles.googleIcon} />
            <Text style={styles.btnText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// --- Estilos ---
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
    fontSize: 48,
    color: '#333',
  },
  stepText: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  robotImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginVertical: 15,
  },
  registerLabel: {
    fontFamily: 'Oxanium_700Bold',
    fontSize: 30,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    height: 45,
    width: '90%',
    marginVertical: 8,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: 'Oxanium_600SemiBold',
    color: '#828282',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#619CE9',
    borderRadius: 16,
    height: 45,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    paddingHorizontal: 30,
    paddingVertical: 10,
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
});