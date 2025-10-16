// src/screens/PerfilScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Oxanium_700Bold } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons';

// --- CAMBIO IMPORTANTE AQUÍ ---
// Ahora el componente recibe `route` para leer los parámetros
export default function PerfilScreen({ route, navigation }) {
  // Obtenemos el email que pasamos desde el navegador de pestañas
  const { email } = route.params;

  // ... (la función getUserData no cambia)
  const getUserData = (userEmail) => {
    if (!userEmail || !userEmail.includes('@')) {
      return { fullName: 'Usuario' };
    }
    // Lógica para el nombre de Google o del correo institucional
    if (userEmail.includes('@gmail.com')) {
        const namePart = userEmail.split('@')[0];
        const names = namePart.split('.');
        const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
        const lastName = names.length > 1 ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
        return { fullName: `${firstName} ${lastName}`.trim() || 'Usuario' };
    } else { // Asumimos que es @unmsm.edu.pe
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
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <LinearGradient
      colors={['#B0ADFF', '#CCFAFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../../assets/img/perfil1.png')}
          style={styles.profileImage}
        />
        {/* --- DATO DINÁMICO --- */}
        <Text style={styles.userName}>{fullName}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Correo electrónico</Text>
            {/* --- DATO DINÁMICO --- */}
            <Text style={styles.infoContent}>{email}</Text>
          </View>
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

// ... (tus estilos no cambian)
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