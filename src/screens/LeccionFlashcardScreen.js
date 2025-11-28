// src/screens/LeccionFlashcardScreen.js - DISEÑO CORREGIDO
import React, { useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Imagen del robot azul
const robot = require('../../assets/img/robot-5.png');

const LeccionFlashcardScreen = ({ navigation, route }) => {
  const { lessonTitle = 'Tipos de datos', lessonNumber = 1 } = route.params || {};
  
  const [currentCard, setCurrentCard] = useState(0);

  // ✅ Ocultar tabs al entrar a esta pantalla
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        swipeEnabled: false,
      });
    }
  }, [navigation]);

  // Datos de las flashcards
  const flashcards = [
    {
      subtitle: 'Introducción',
      content: 'En programación, los tipos de datos definen la clase de información que puede manejar una variable dentro de un programa.',
      examples: [
        { 
          label: 'Enteros (int):', 
          description: 'Números sin decimales, como 5 o -12', 
          color: '#FFC8F4' // Rosa
        },
        { 
          label: 'Reales (float/double):', 
          description: 'Números con decimales, como 3.14 o -0.5', 
          color: '#C8E5FF' // Celeste
        },
        { 
          label: 'Cadenas (string):', 
          description: 'Texto compuesto por caracteres, como "Hola"', 
          color: '#E5C8FF' // Morado
        },
        { 
          label: 'Booleanos (bool):', 
          description: 'Valores lógicos que representan V o F', 
          color: '#C8FFE5' // Verde
        },
      ],
    },
  ];

  const currentFlashcard = flashcards[currentCard];
  const progress = (currentCard + 1) / flashcards.length;

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
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#D5E6FF', '#E6F7FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#52328C" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{lessonTitle}</Text>
              <Text style={styles.headerSubtitle}>{currentFlashcard.subtitle}</Text>
            </View>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Contenido */}
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Card blanca con descripción */}
          <View style={styles.whiteCard}>
            <Text style={styles.introText}>{currentFlashcard.content}</Text>
          </View>

          {/* Card blanca con tabla de tipos de datos */}
          <View style={styles.whiteCard}>
            {currentFlashcard.examples.map((example, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.labelBox, { backgroundColor: example.color }]}>
                  <Text style={styles.labelText}>{example.label}</Text>
                </View>
                <Text style={styles.descriptionText}>{example.description}</Text>
              </View>
            ))}
          </View>

          {/* Robot azul con plataforma */}
          <View style={styles.robotContainer}>
            <View style={styles.robotPlatform} />
            <Image source={robot} style={styles.robotImage} />
          </View>
        </ScrollView>

        {/* Controles de navegación */}
        <View style={styles.controls}>
          {currentCard > 0 && (
            <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
              <Ionicons name="arrow-back" size={24} color="#7C3FE0" />
              <Text style={styles.previousButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          <View style={styles.controlsSpacer} />

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Ionicons name="arrow-forward" size={32} color="white" />
          </TouchableOpacity>
        </View>

        {/* Indicador de progreso */}
        <View style={styles.progressIndicator}>
          {flashcards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentCard && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
  closeButton: {
    padding: 5,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
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
    paddingTop: 30,
    paddingBottom: 20,
  },
  whiteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  tableRow: {
    marginBottom: 12,
  },
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
    position: 'relative',
  },
  robotPlatform: {
    position: 'absolute',
    bottom: 0,
    width: 140,
    height: 70,
    backgroundColor: '#2B7BB9',
    borderRadius: 70,
    opacity: 0.3,
  },
  robotImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  controlsSpacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#7C3FE0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  progressDotActive: {
    backgroundColor: '#7C3FE0',
    width: 24,
  },
});

export default LeccionFlashcardScreen;