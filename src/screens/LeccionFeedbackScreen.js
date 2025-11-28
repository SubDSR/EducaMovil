// src/screens/LeccionFeedbackScreen.js - CON BLOQUEO DE BOTÓN ATRÁS
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const robotMeme = require('../../assets/img/robot_meme.png');
const fondoEstrellas = require('../../assets/img/fondo_estrellas.png');

const { width, height } = Dimensions.get('window');

const LeccionFeedbackScreen = ({ navigation, route }) => {
  const { isCorrect = true, stats = {}, lessonTitle = 'Tipos de datos' } = route.params || {};
  
  const { aciertos = 1, rapidez = '15s', errores = 0 } = stats;
  const xpEarned = 50;

  // 👤 Estados para información del usuario
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('Usuario');

  // Animación flotante del robot
  const floatAnim = useRef(new Animated.Value(0)).current;

  // ❌ OCULTAR TABS al entrar a esta pantalla
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        swipeEnabled: false,
      });
    }
  }, [navigation]);

  // 🚫 BLOQUEAR BOTÓN DE RETROCESO DE ANDROID
  useEffect(() => {
    const backAction = () => {
      // Mostrar alerta en lugar de permitir retroceso
      Alert.alert(
        "¿Seguro que quieres salir?",
        "Perderás tu progreso si regresas ahora.",
        [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          { 
            text: "Salir", 
            onPress: () => {
              // Resetear navegación para prevenir volver atrás
              navigation.reset({
                index: 0,
                routes: [{ name: 'Cursos' }],
              });
            },
            style: "destructive"
          }
        ]
      );
      return true; // ✅ Bloquea el comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // ✅ Limpiar al desmontar
  }, [navigation]);

  // 🔍 Cargar información del usuario al montar el componente
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
        setEmail(user.email);
        
        const name = getUserData(user.email, user);
        setUserName(name);
      } else {
        const savedEmail = await AsyncStorage.getItem('@user_email');
        if (savedEmail) {
          setEmail(savedEmail);
          const name = getUserData(savedEmail, null);
          setUserName(name);
        }
      }
    } catch (error) {
      setUserName('Usuario');
    }
  };

  const getUserData = (userEmail, userInfoData) => {
    if (!userEmail || !userEmail.includes('@')) {
      return 'Usuario';
    }
    
    // Si tenemos información de Google (nombre completo)
    if (userInfoData?.name) {
      return userInfoData.name;
    }
    
    // Lógica para el nombre de Google o del correo institucional
    if (userEmail.includes('@gmail.com')) {
      const namePart = userEmail.split('@')[0];
      const names = namePart.split('.');
      const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
      const lastName = names.length > 1 ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
      return `${firstName} ${lastName}`.trim() || 'Usuario';
    } else {
      // Asumimos que es @unmsm.edu.pe
      const namePart = userEmail.split('@')[0];
      const names = namePart.split('.');
      const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
      const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
      return `${firstName} ${lastName}`.trim() || 'Usuario';
    }
  };

  useEffect(() => {
    // Animación de flotación infinita
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handleContinue = () => {
    // ✅ Navegar a TiposDeDatos (TiposDeDatos se encargará de ocultar tabs)
    navigation.navigate('TiposDeDatos');
  };

  return (
    <View style={styles.container}>
      {/* Fondo de estrellas */}
      <Image 
        source={fondoEstrellas} 
        style={styles.backgroundStars}
        resizeMode="cover"
      />

      {/* Contenido principal */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* 👤 Nombre del usuario dinámico */}
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.rank}>Rango Bronce</Text>

          {/* Robot con animación flotante */}
          <View style={styles.robotContainer}>
            <Animated.Image
              source={robotMeme}
              style={[
                styles.robotImage,
                {
                  transform: [{ translateY: floatAnim }],
                },
              ]}
              resizeMode="contain"
            />
          </View>

          {/* Mensaje de XP */}
          <View style={styles.xpContainer}>
            <Text style={styles.congratsText}>¡Felicidades! Has conseguido</Text>
            <Text style={styles.xpText}>+ {xpEarned} xp</Text>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{aciertos}</Text>
              <Text style={styles.statLabel}>aciertos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rapidez}</Text>
              <Text style={styles.statLabel}>rapidez</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{errores}</Text>
              <Text style={styles.statLabel}>errores</Text>
            </View>
          </View>

          {/* Botón continuar */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundStars: {
    position: 'absolute',
    top: '55%',
    left: '47%',
    width: width * 0.95,
    height: height * 0.7,
    transform: [
      { translateX: -width * 0.475 },
      { translateY: -height * 0.35 },
    ],
    opacity: 0.6,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  rank: {
    fontSize: 16,
    color: '#444',
    marginBottom: 15,
  },
  robotContainer: {
    paddingVertical: 20,
    marginBottom: 10,
  },
  robotImage: {
    width: 180,
    height: 180,
  },
  xpContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  congratsText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
  },
  xpText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#5B3FB2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#1B1234',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LeccionFeedbackScreen;