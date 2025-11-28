// src/screens/LoginScreen.js - CON KEYBOARDAVOIDINGVIEW
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFonts, Oxanium_700Bold, Oxanium_600SemiBold } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Importa tus imágenes ---
import backgroundImage from '../../assets/img/login-background.png';
import unmsmLogo from '../../assets/img/logo-unmsm.png';
import robotImage from '../../assets/img/robot-2.png';
import googleIcon from '../../assets/img/google-logo.png';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Configuración de Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '980386025823-tcm16nn8kv1hcgq3bvt63bqp09odng6u.apps.googleusercontent.com',
    webClientId: '980386025823-ldlas1541tmj65l8t919j5vt7ihril8f.apps.googleusercontent.com',
  });

  let [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Oxanium_600SemiBold,
  });

  // Limpiar sesión al cargar la pantalla de login
  useEffect(() => {
    clearSession();
  }, []);

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.log('Error clearing session:', error);
    }
  };

  // Manejar la respuesta de Google
  useEffect(() => {
    handleGoogleSignIn();
  }, [response]);

  const handleGoogleSignIn = async () => {
    if (response?.type === 'success') {
      setLoading(true);
      try {
        const { accessToken } = response.authentication;
        const userInfo = await getUserInfo(accessToken);
        
        if (userInfo) {
          await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
          navigation.replace('Welcome', { email: userInfo.email });
        }
      } catch (error) {
        console.error('Error during Google sign in:', error);
        Alert.alert('Error', 'No se pudo completar el inicio de sesión con Google');
      } finally {
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      console.error('Error durante la autenticación:', response.error);
      Alert.alert('Error', 'Error al iniciar sesión con Google');
    }
  };

  const getUserInfo = async (token) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (email.trim().toLowerCase().endsWith('@unmsm.edu.pe')) {
      try {
        const userInfo = {
          email: email.trim().toLowerCase(),
        };
        
        await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
        navigation.navigate('Welcome', { email: userInfo.email });
      } catch (error) {
        console.error('Error guardando usuario:', error);
        Alert.alert('Error', 'No se pudo guardar la sesión');
      }
    } else {
      Alert.alert(
        "Correo Inválido",
        "Por favor, utiliza tu correo institucional (@unmsm.edu.pe) para iniciar sesión."
      );
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#619CE9" />
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Image source={unmsmLogo} style={styles.logo} />
              
              <View style={styles.container}>
                <Text style={styles.title}>EducaMovil</Text>
                <Text style={styles.stepText}>Bienvenido de vuelta</Text>
                <Image source={robotImage} style={styles.robotImage} />
                <Text style={styles.registerLabel}>Iniciar Sesión</Text>

                {/* Campo de Correo */}
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#828282" />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#828282"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Campo de Contraseña */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#828282" />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#828282"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#828282"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.googleBtn} 
                  onPress={handleGoogleLogin}
                  disabled={!request}
                >
                  <Image source={googleIcon} style={styles.googleIcon} />
                  <Text style={styles.btnText}>Continuar con Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.registerLinkText}>
                    ¿No tienes cuenta? <Text style={styles.registerLinkBold}>Regístrate</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#619CE9',
    fontFamily: 'Oxanium_600SemiBold',
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
    marginBottom: 15,
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
  registerLink: {
    marginTop: 10,
    marginBottom: 20,
  },
  registerLinkText: {
    fontSize: 14,
    color: '#555',
  },
  registerLinkBold: {
    fontWeight: 'bold',
    color: '#619CE9',
  },
});