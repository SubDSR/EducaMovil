// src/screens/LeccionFeedbackScreen.js - VERSIÓN FINAL INTEGRADA
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
  AccessibilityInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const robotMeme = require('../../assets/img/robot_meme.png');
const fondoEstrellas = require('../../assets/img/fondo_estrellas.png');

const { width, height } = Dimensions.get('window');

const LeccionFeedbackScreen = ({ navigation, route }) => {
  const { isCorrect = true, stats = {}, lessonTitle = 'Tipos de datos' } = route.params || {};
  
  // Extraemos estadísticas
  const { aciertos = 1, rapidez = '0s', errores = 0 } = stats;
  const xpEarned = 50;

  // 👤 Estados para información del usuario
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('Usuario');
  
  // 🔊 Estado para accesibilidad
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  // Animación flotante del robot
  const floatAnim = useRef(new Animated.Value(0)).current;

  // 1. DETECCIÓN DE TALKBACK
  useEffect(() => {
    const checkScreenReader = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(isEnabled);
    };
    checkScreenReader();
    
    // Escuchar cambios por si el usuario activa/desactiva TalkBack en esta pantalla
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged', 
      setIsScreenReaderEnabled
    );
    return () => subscription.remove();
  }, []);

  // 2. GENERACIÓN DEL MENSAJE DE LECTURA AUTOMÁTICA
  // Construimos el mensaje aquí para usarlo tanto en el Overlay como en la lógica visual si fuera necesario
  const getAccessibilityMessage = () => {
    const saludo = isCorrect ? `¡Felicidades ${userName}!` : `Has completado la lección, ${userName}.`;
    const resumen = `Obtuviste ${aciertos} aciertos, con una rapidez de ${rapidez}, y ${errores} errores.`;
    const experiencia = `Ganaste ${xpEarned} puntos de experiencia.`;
    const instruccion = "Toca dos veces en cualquier parte de la pantalla para continuar.";
    
    return `${saludo} ${resumen} ${experiencia} ${instruccion}`;
  };

  // ❌ OCULTAR TABS
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        swipeEnabled: false,
      });
    }
  }, [navigation]);

  // 🚫 BLOQUEAR BOTÓN ATRÁS
  useEffect(() => {
    const backAction = () => {
      // Si TalkBack está activo, el botón atrás funciona como "Continuar" para no atrapar al usuario
      if (isScreenReaderEnabled) {
        handleContinue();
        return true;
      }
      
      Alert.alert(
        "¿Salir?",
        "Regresarás al menú principal.",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Salir", 
            onPress: () => navigation.navigate('TiposDeDatos'),
            style: "destructive" 
          }
        ]
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation, isScreenReaderEnabled]);

  // 🔍 Cargar info usuario
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
        setUserName(getUserData(user.email, user));
      } else {
        const savedEmail = await AsyncStorage.getItem('@user_email');
        if (savedEmail) {
          setEmail(savedEmail);
          setUserName(getUserData(savedEmail, null));
        }
      }
    } catch (error) {
      setUserName('Usuario');
    }
  };

  const getUserData = (userEmail, userInfoData) => {
    if (userInfoData?.name) return userInfoData.name;
    if (!userEmail || !userEmail.includes('@')) return 'Usuario';
    const namePart = userEmail.split('@')[0];
    const names = namePart.split('.');
    const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
    return firstName || 'Usuario';
  };

  // Animación Robot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  const handleContinue = () => {
    if (!isScreenReaderEnabled) {
        // Solo anunciamos si NO hay TalkBack activo (para feedback sonoro en modo normal si se deseara)
        // Ojo: Si TalkBack está activo, no anunciamos nada al salir para no cortar el flujo del menú siguiente.
    }
    navigation.navigate('TiposDeDatos');
  };

  return (
    <View style={styles.container}>
      {/* Fondo decorativo */}
      <Image 
        source={fondoEstrellas} 
        style={styles.backgroundStars} 
        resizeMode="cover" 
        // Ocultamos el fondo a la accesibilidad siempre
        importantForAccessibility="no-hide-descendants" 
      />

      {/* CONTENIDO VISUAL 
         Si TalkBack está activado, ocultamos TODO este bloque del lector ('no-hide-descendants').
         ¿Por qué? Porque la Capa Mágica (Overlay) se encargará de leer todo.
         Esto evita que el lector lea primero la capa mágica y luego intente leer los textos de abajo duplicados.
      */}
      <SafeAreaView 
        style={styles.safeArea}
        importantForAccessibility={isScreenReaderEnabled ? "no-hide-descendants" : "yes"}
      >
        <View style={styles.content}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.rank}>Rango Bronce</Text>

          <View style={styles.robotContainer}>
            <Animated.Image
              source={robotMeme}
              style={[styles.robotImage, { transform: [{ translateY: floatAnim }] }]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.xpContainer}>
            <Text style={styles.congratsText}>¡Felicidades! Has conseguido</Text>
            <Text style={styles.xpText}>+ {xpEarned} xp</Text>
          </View>

          {/* Estadísticas Visuales */}
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

          {/* Botón visual (solo visible si TalkBack está APAGADO, ya que con TalkBack usamos el Overlay) */}
          {!isScreenReaderEnabled && (
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* ⭐⭐ CAPA MÁGICA DE ACCESIBILIDAD (OVERLAY) ⭐⭐
         Se activa SOLO si TalkBack está ON.
         1. Cubre toda la pantalla.
         2. Contiene TODO el texto en su `accessibilityLabel`.
         3. Al cargar la pantalla, TalkBack enfoca esto automáticamente y lee todo el mensaje.
         4. Al tocar dos veces, ejecuta `handleContinue`.
      */}
      {isScreenReaderEnabled && (
        <TouchableOpacity
          style={styles.accessibilityOverlay}
          onPress={handleContinue}
          activeOpacity={1} // Sin feedback visual
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={getAccessibilityMessage()} // <--- AQUÍ ESTÁ LA LECTURA AUTOMÁTICA
          accessibilityViewIsModal={true} // Atrapa el foco aquí
        >
          {/* Capa invisible */}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Estilo del Overlay Mágico
  accessibilityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Asegura estar encima de todo
    backgroundColor: 'transparent', 
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