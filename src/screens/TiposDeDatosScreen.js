// src/screens/TiposDeDatosScreen.js - VERSIÓN FINAL INTEGRADA
import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
  AccessibilityInfo, // Esencial para detectar TalkBack y hacer anuncios
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LevelNode from '../components/LevelNode';
import LessonBubble from '../components/LessonBubble';

// Imágenes
const robot3 = require('../../assets/img/robot-3.png');
const robot4 = require('../../assets/img/robot-4.png');
const robot5 = require('../../assets/img/robot-5.png');
const robot6 = require('../../assets/img/robot-6.png');
const robot7 = require('../../assets/img/robot-7.png');
const robot8 = require('../../assets/img/robot-8.png');

const TiposDeDatosScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  // 1. --- DETECCIÓN DE TALKBACK ---
  useEffect(() => {
    const checkScreenReader = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(isEnabled);
    };
    checkScreenReader();
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setIsScreenReaderEnabled);
    return () => subscription.remove();
  }, []);

  // 2. --- INTRODUCCIÓN DE AUDIO (Del código 2) ---
  useEffect(() => {
    // Solo anunciamos si no hay un nivel seleccionado al inicio
    if (!selectedLevel) {
      const introMessage = 
        "Bienvenido a la ruta de aprendizaje de Tipos de Datos. " +
        "Esta pantalla es un mapa vertical. " +
        "Encontrarás niveles desbloqueados, tu nivel actual marcado con una imagen, " +
        "y lecciones futuras bloqueadas. " +
        "Selecciona un nivel y luego toca dos veces en cualquier parte para comenzar.";

      // Pequeño retraso para asegurar que la pantalla cargó y TalkBack está listo
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(introMessage);
      }, 1000);
    }
  }, []); // Se ejecuta solo al montar

  // 3. --- GESTIÓN DE TABS ---
  const showTabs = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          backgroundColor: '#52328C',
          height: Platform.OS === 'android' ? 90 : 100,
          paddingBottom: Platform.OS === 'android' ? 30 : 40,
          paddingTop: Platform.OS === 'android' ? 5 : 15,
          justifyContent: 'center',
        },
        swipeEnabled: true,
      });
    }
  };

  const hideTabs = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: 'none' }, swipeEnabled: false });
    }
  };

  useLayoutEffect(() => {
    hideTabs();
    return () => showTabs();
  }, [navigation]);

  // 4. --- BACK HANDLER INTELIGENTE (Del código 1) ---
  useEffect(() => {
    const backAction = () => {
      // Si hay un nivel seleccionado, el botón atrás solo cierra la selección (burbuja)
      if (selectedLevel) {
        setSelectedLevel(null);
        return true;
      }
      // Si no hay selección, volvemos al menú principal
      showTabs();
      setTimeout(() => navigation.navigate('Cursos'), 50);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation, selectedLevel]);

  // --- DATOS ---
  const lessons = [
    { id: 1, title: 'Tipos de datos fundamentales', position: { left: 50, top: 20 }, status: 'unlocked' },
    { id: 2, title: 'Enteros y decimales', position: { left: 140, top: 80 }, status: 'unlocked' },
    { id: 3, title: 'Cadenas de texto', position: { left: 230, top: 140 }, status: 'unlocked' },
    { id: 4, title: 'Booleanos', position: { left: 190, top: 230 }, status: 'unlocked' },
    { id: 5, title: 'Conversión de tipos', position: { left: 230, top: 320 }, status: 'current' },
    { id: 6, title: 'Operadores aritméticos', position: { left: 140, top: 380 }, status: 'locked' },
    { id: 7, title: 'Operadores lógicos', position: { left: 50, top: 440 }, status: 'locked' },
    { id: 8, title: 'Operadores de comparación', position: { left: 90, top: 530 }, status: 'locked' },
    { id: 9, title: 'Variables y constantes', position: { left: 50, top: 620 }, status: 'locked' },
    { id: 10, title: 'Alcance de variables', position: { left: 140, top: 680 }, status: 'locked' },
  ];

  // --- LÓGICA DE SELECCIÓN Y NAVEGACIÓN ---
  const handleLevelPress = (lesson) => {
    if (lesson.status === 'current' || lesson.status === 'unlocked') {
      const isSelecting = selectedLevel?.id !== lesson.id;
      setSelectedLevel(isSelecting ? lesson : null);

      // Si TalkBack está activo y abrimos un nivel, damos la instrucción de confirmación global
      if (isScreenReaderEnabled && isSelecting) {
        AccessibilityInfo.announceForAccessibility(
          `Has seleccionado ${lesson.title}. Toca dos veces en cualquier parte de la pantalla para comenzar.`
        );
      }
    }
  };

  const startLesson = (lesson) => {
    // Si no pasamos lección (ej. desde el overlay ciego), usamos la seleccionada actualmente
    const targetLesson = lesson || selectedLevel;
    if (targetLesson) {
      setSelectedLevel(null);
      navigation.navigate('LeccionFlashcard', { 
        lessonTitle: targetLesson.title,
        lessonNumber: targetLesson.id 
      });
    }
  };

  const handleGoBack = () => {
    showTabs();
    setTimeout(() => navigation.navigate('Cursos'), 50);
  };

  // Calculadora de posición visual
  const getBubblePosition = (levelPosition) => {
    const BUBBLE_WIDTH = 280;
    const SCREEN_WIDTH = 360;
    const MARGIN = 20;
    const LEVEL_WIDTH = 80;
    const HEADER_HEIGHT = 130;
    
    let left = levelPosition.left + (LEVEL_WIDTH / 2) - (BUBBLE_WIDTH / 2);
    let top = levelPosition.top - 120;
    let arrowPosition = 'top';
    
    if (left < MARGIN) left = MARGIN;
    else if (left + BUBBLE_WIDTH > SCREEN_WIDTH - MARGIN) left = SCREEN_WIDTH - BUBBLE_WIDTH - MARGIN;
    
    if (top < HEADER_HEIGHT) {
      arrowPosition = 'bottom';
      top = levelPosition.top + 90;
    }
    
    return { 
      left, 
      top, 
      arrowPosition, 
      arrowOffset: (levelPosition.left + LEVEL_WIDTH / 2) - (left + BUBBLE_WIDTH / 2) 
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View 
        style={styles.header} 
        accessible={true} 
        accessibilityLabel="Mapa de lecciones de Tipos de Datos"
      >
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.backButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Volver al menú principal de cursos"
        >
          <Ionicons name="menu" size={24} color="white" />
          <Text style={styles.headerTitle}>Tipos de datos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Robots Decorativos (Silenciados para accesibilidad) */}
        <Image source={robot3} style={[styles.robot, { left: 30, top: 170 }]} accessible={false} />
        <Image source={robot4} style={[styles.robot, { left: 30, top: 1370 }]} accessible={false} />
        <Image source={robot5} style={[styles.robot, { left: 30, top: 740 }]} accessible={false} />
        <Image source={robot6} style={[styles.robot, { left: 200, top: 450 }]} accessible={false} />
        <Image source={robot7} style={[styles.robot, { left: 200, top: 1080 }]} accessible={false} />
        <Image source={robot8} style={[styles.robot, { left: 200, top: 1630 }]} accessible={false} />

        {/* Burbuja VISUAL */}
        {selectedLevel && (() => {
          const bubblePos = getBubblePosition(selectedLevel.position);
          return (
            <LessonBubble
              title={selectedLevel.title}
              lessonNumber={selectedLevel.id}
              onStart={() => startLesson(selectedLevel)}
              style={{ left: bubblePos.left, top: bubblePos.top }}
              arrowPosition={bubblePos.arrowPosition}
              arrowOffset={bubblePos.arrowOffset}
              // TRUCO: Si TalkBack está ON, ocultamos esta burbuja del lector.
              // El lector interactuará con el Overlay Gigante en su lugar.
              isAccessibilityHidden={isScreenReaderEnabled}
            />
          );
        })()}

        {/* Nodos de Nivel */}
        {lessons.map((lesson) => (
          <LevelNode
            key={lesson.id}
            status={lesson.status}
            style={lesson.position}
            onPress={() => handleLevelPress(lesson)}
            accessibilityLabel={
              `Lección ${lesson.id}: ${lesson.title}. ` +
              (lesson.status === 'current' ? 'Nivel actual, toca dos veces para seleccionar.' : 
               lesson.status === 'unlocked' ? 'Nivel completado, toca dos veces para repasar.' : 
               'Nivel bloqueado.')
            }
          />
        ))}

        {/* Nodos bloqueados (Placeholder) */}
        {[...Array(10)].map((_, index) => (
          <LevelNode
            key={`locked-${index + 11}`}
            status="locked"
            style={{ 
              left: [230, 140, 50, 90, 50, 140, 230, 190, 230, 140][index],
              top: 810 + (index * 90)
            }}
            accessibilityLabel={`Nivel futuro ${index + 11}, bloqueado.`}
          />
        ))}
      </ScrollView>

      {/* ⭐⭐ CAPA MÁGICA DE ACCESIBILIDAD ⭐⭐
        Se activa SOLO si:
        1. TalkBack está encendido
        2. Hay un nivel seleccionado
        Cubre toda la pantalla para capturar el "doble toque en cualquier lugar".
      */}
      {isScreenReaderEnabled && selectedLevel && (
        <TouchableOpacity
          style={styles.accessibilityOverlay}
          onPress={() => startLesson()}
          activeOpacity={1} // Sin efecto visual al presionar
          accessible={true}
          accessibilityRole="button"
          // Instrucción clara para el lector
          accessibilityLabel={`Confirmar comenzar ${selectedLevel.title}. Toca dos veces aquí o en cualquier parte para iniciar.`}
          accessibilityViewIsModal={true} // Atrapa el foco de TalkBack aquí
        >
          {/* Es transparente, no se ve, pero se siente */}
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#D5E6FF' },
  header: { backgroundColor: '#987ACC', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#52328C', borderRadius: 16, paddingVertical: 20, paddingHorizontal: 20, alignSelf: 'flex-start' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  container: { height: 2080, position: 'relative' },
  robot: { position: 'absolute', width: 150, height: 150, resizeMode: 'contain' },
  
  // Estilo crucial para la capa invisible
  accessibilityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Asegura estar encima de todo
    backgroundColor: 'transparent', // Invisible
  }
});

export default TiposDeDatosScreen;