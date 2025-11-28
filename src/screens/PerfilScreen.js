// src/screens/PerfilScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Oxanium_700Bold } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ route, navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');

  // ✅ MOSTRAR TABS Y PERMITIR SWIPE
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          backgroundColor: '#52328C',
          height: 80,
          justifyContent: 'center',
        },
        swipeEnabled: true, // ✅ Permitir swipe
      });
    }
  }, [navigation]);

  // Cargar información del usuario al montar el componente
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      // Primero intentamos obtener los datos de AsyncStorage
      const userData = await AsyncStorage.getItem('@user');
      
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
        setEmail(user.email);
      } else {
        // Si no hay datos en AsyncStorage, usamos el email de route.params
        const { email: paramEmail } = route.params || {};
        if (paramEmail) {
          setEmail(paramEmail);
        }
      }
    } catch (error) {
      // Si hay error, intentamos usar el email de los parámetros
      const { email: paramEmail } = route.params || {};
      if (paramEmail) {
        setEmail(paramEmail);
      }
    }
  };

  const getUserData = (userEmail) => {
    if (!userEmail || !userEmail.includes('@')) {
      return { fullName: 'Usuario' };
    }
    
    // Si tenemos información de Google (nombre completo)
    if (userInfo?.name) {
      return { fullName: userInfo.name };
    }
    
    // Lógica para el nombre de Google o del correo institucional
    if (userEmail.includes('@gmail.com')) {
      const namePart = userEmail.split('@')[0];
      const names = namePart.split('.');
      const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
      const lastName = names.length > 1 ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
      return { fullName: `${firstName} ${lastName}`.trim() || 'Usuario' };
    } else {
      // Asumimos que es @unmsm.edu.pe
      const namePart = userEmail.split('@')[0];
      const names = namePart.split('.');
      const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
      const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
      return { fullName: `${firstName} ${lastName}`.trim() || 'Usuario' };
    }
  };

  const { fullName } = getUserData(email);

  let [fontsLoaded] = useFonts({
    Oxanium_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.log('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#B0ADFF', '#CCFAFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Mostrar la imagen de perfil de Google si está disponible */}
        {userInfo?.picture ? (
          <Image
            source={{ uri: userInfo.picture }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require('../../assets/img/perfil1.png')}
            style={styles.profileImage}
          />
        )}
        
        <Text style={styles.userName}>{fullName}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Correo electrónico</Text>
            <Text style={styles.infoContent}>{email || 'No disponible'}</Text>
          </View>

          {/* Mostrar badge de verificado si el email está verificado */}
          {userInfo?.verified_email && (
            <View style={styles.verifiedSection}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.verifiedText}>Cuenta verificada</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Ionicons name="logo-google" size={18} color="#555" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cambiar cuenta de Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Oxanium_700Bold',
    color: '#0E0220',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: '100%',
    borderRadius: 16,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoContent: {
    fontSize: 16,
    color: '#111',
    marginTop: 5,
  },
  verifiedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifiedText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#985afd',
    borderColor: 'transparent',
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
});