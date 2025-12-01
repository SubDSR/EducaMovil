// src/screens/LeccionFlashcardScreen.js - LECTURA AUTOMÁTICA COMPLETA
import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Imágenes
const robot = require('../../assets/img/robot-5.png');
const perfilButton = require('../../assets/img/perfil-button.png');

const LeccionFlashcardScreen = ({ navigation, route }) => {
  const { lessonTitle = 'Tipos de datos', lessonNumber = 1 } = route.params || {};
  const [currentCard, setCurrentCard] = useState(0);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [shouldBlockAccessibility, setShouldBlockAccessibility] = useState(true);

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

  // Ocultar tabs al entrar
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        swipeEnabled: false,
      });
    }
  }, [navigation]);

  // Bloquear botón físico atrás
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('TiposDeDatos');
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Datos de las flashcards
  const flashcards = [
    {
      subtitle: 'Introducción',
      content: 'En programación, los tipos de datos definen la clase de información que puede manejar una variable dentro de un programa.',
      examples: [
        { label: 'Enteros (int):', description: 'Números sin decimales, como 5 o -12', color: '#FFC8F4' },
        { label: 'Reales (float/double):', description: 'Números con decimales, como 3.14 o -0.5', color: '#C8E5FF' },
        { label: 'Cadenas (string):', description: 'Texto compuesto por caracteres, como "Hola"', color: '#E5C8FF' },
        { label: 'Booleanos (bool):', description: 'Valores lógicos que representan verdadero o falso', color: '#C8FFE5' },
      ],
    },
  ];

  const currentFlashcard = flashcards[currentCard];
  const progress = (currentCard + 1) / flashcards.length;
  const isLastCard = currentCard === flashcards.length - 1;

  // 2. --- LECTURA AUTOMÁTICA COMPLETA AL ENTRAR ---
  useEffect(() => {
    // Solo si TalkBack está activo, no hemos reproducido el intro, y es la primera tarjeta
    if (isScreenReaderEnabled && !hasPlayedIntro && currentCard === 0) {
      // Bloqueamos elementos temporalmente
      setShouldBlockAccessibility(true);

      // Construimos el mensaje COMPLETO
      let messageToRead = `Estás en la lección: ${lessonTitle}. ${currentFlashcard.subtitle}. `;
      
      // Añadimos el contenido principal
      messageToRead += `${currentFlashcard.content}. `;
      
      // Añadimos TODOS los ejemplos
      if (currentFlashcard.examples && currentFlashcard.examples.length > 0) {
        messageToRead += "Los tipos de datos son los siguientes: ";
        currentFlashcard.examples.forEach((ex, index) => {
          // Leemos cada ejemplo completo
          messageToRead += `${ex.label} ${ex.description}. `;
        });
      }

      // Añadimos la información de navegación
      if (isLastCard) {
        messageToRead += "Al inicio de la pantalla, en la parte superior derecha, encontrarás un botón para cerrar la lección. Del mismo modo, al final de la pantalla, en la parte inferior, encontrarás un botón redondo para ir a los ejercicios.";
      } else {
        messageToRead += "Al final de la pantalla, encontrarás un botón para ir a la siguiente tarjeta.";
      }

      // Esperamos 1.5 segundos para que TalkBack esté listo
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(messageToRead);
        setHasPlayedIntro(true);
        
        // Calculamos la duración aproximada del mensaje
        // Promedio de lectura: 150 palabras por minuto = 2.5 palabras por segundo
        // Estimamos ~40-50 palabras = ~20 segundos
        const estimatedDuration = 22000; // 22 segundos
        
        // Desbloqueamos después de que termine el mensaje
        setTimeout(() => {
          setShouldBlockAccessibility(false);
        }, estimatedDuration);
      }, 1500);
    }
  }, [isScreenReaderEnabled, hasPlayedIntro, currentCard]);

  // 3. --- LECTURA AL CAMBIAR DE TARJETA ---
  useEffect(() => {
    // Si ya pasó el intro inicial y cambiamos de tarjeta
    if (hasPlayedIntro && currentCard > 0) {
      // Bloqueamos temporalmente
      setShouldBlockAccessibility(true);

      let messageToRead = `${currentFlashcard.subtitle}. ${currentFlashcard.content}. `;
      
      if (currentFlashcard.examples && currentFlashcard.examples.length > 0) {
        messageToRead += "Los tipos de datos son los siguientes: ";
        currentFlashcard.examples.forEach((ex) => {
          messageToRead += `${ex.label} ${ex.description}. `;
        });
      }

      if (isLastCard) {
        messageToRead += "Al inicio de la pantalla, en la parte superior derecha, encontrarás un botón para cerrar la lección. Del mismo modo, al final de la pantalla, en la parte inferior, encontrarás un botón redondo para ir a los ejercicios.";
      } else {
        messageToRead += "Al final de la pantalla, encontrarás un botón para ir a la siguiente tarjeta.";
      }

      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(messageToRead);
        
        const estimatedDuration = 22000;
        setTimeout(() => {
          setShouldBlockAccessibility(false);
        }, estimatedDuration);
      }, 500);
    }
  }, [currentCard, hasPlayedIntro]);

  // Navegación
  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      navigation.navigate('LeccionQuiz', { lessonTitle, lessonNumber });
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleClose = () => {
    navigation.navigate('TiposDeDatos');
  };

  return (
    <LinearGradient colors={['#D5E6FF', '#E6F7FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* ⭐ OVERLAY DE LECTURA (solo si TalkBack está ON y estamos bloqueados) ⭐ */}
        {isScreenReaderEnabled && shouldBlockAccessibility && (
          <View
            style={styles.readingOverlay}
            accessible={true}
            accessibilityLabel="Escucha la lección completa. La navegación estará disponible en un momento."
            accessibilityViewIsModal={true}
          >
            {/* Overlay invisible que captura el foco mientras se lee */}
          </View>
        )}

        {/* Header */}
        <View
          style={styles.header}
          accessible={true}
          accessibilityLabel={`Encabezado de lección ${lessonTitle}`}
          importantForAccessibility={shouldBlockAccessibility && isScreenReaderEnabled ? "no-hide-descendants" : "yes"}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cerrar lección y volver al menú principal"
            >
              <Ionicons name="close" size={28} color="#52328C" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{lessonTitle}</Text>
              <Text style={styles.headerSubtitle}>{currentFlashcard.subtitle}</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Contenido */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          importantForAccessibility={shouldBlockAccessibility && isScreenReaderEnabled ? "no-hide-descendants" : "auto"}
        >
          <View
            style={styles.whiteCard}
            accessible={true}
            accessibilityLabel={`Contenido principal: ${currentFlashcard.content}`}
          >
            <Text style={styles.introText}>{currentFlashcard.content}</Text>
          </View>

          <View style={styles.whiteCard}>
            {currentFlashcard.examples.map((example, index) => (
              <View
                key={index}
                style={styles.tableRow}
                accessible={true}
                accessibilityLabel={`${example.label}. ${example.description}`}
              >
                <View style={[styles.labelBox, { backgroundColor: example.color }]}>
                  <Text style={styles.labelText}>{example.label}</Text>
                </View>
                <Text style={styles.descriptionText}>{example.description}</Text>
              </View>
            ))}
          </View>

          <View style={styles.robotContainer}>
            <Image
              source={robot}
              style={styles.robotImage}
              accessible={true}
              accessibilityLabel="Ilustración de un robot acompañante"
            />
          </View>
        </ScrollView>

        {/* Controles de navegación */}
        <View 
          style={styles.controls}
          importantForAccessibility={shouldBlockAccessibility && isScreenReaderEnabled ? "no-hide-descendants" : "auto"}
        >
          
          {currentCard > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePrevious}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Volver a la tarjeta anterior"
            >
              <Ionicons name="arrow-back" size={24} color="#7C3FE0" />
              <Text style={styles.previousButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          <View style={styles.controlsSpacer} />

          {/* Siguiente - Botón con imagen perfil-button */}
          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButtonContainer}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isLastCard ? "Ir a los ejercicios" : "Siguiente tarjeta"}
            accessibilityHint={isLastCard ? "Toca dos veces para comenzar el cuestionario" : "Toca dos veces para ver más contenido"}
          >
            <Image source={perfilButton} style={styles.nextButtonImage} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  
  // Overlay de lectura (invisible pero captura el foco)
  readingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    backgroundColor: 'transparent',
  },
  
  header: {
    backgroundColor: '#987ACC',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: { padding: 5, marginRight: 15 },
  titleContainer: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#52328C',
    borderRadius: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  whiteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introText: {
    padding: 10,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  tableRow: { marginBottom: 12 },
  labelBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 6,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    paddingLeft: 5,
  },
  robotContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  robotImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  previousButtonText: {
    fontSize: 16,
    color: '#7C3FE0',
    fontWeight: '600',
  },
  controlsSpacer: { flex: 1 },
  nextButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  nextButtonImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
});

export default LeccionFlashcardScreen;