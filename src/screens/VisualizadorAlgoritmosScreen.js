// src/screens/VisualizadorAlgoritmosScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function VisualizadorAlgoritmosScreen({ navigation, route }) {
  const { algorithmName = 'Bubble sort' } = route.params || {};
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.3);

  // Datos del algoritmo - pasos de Bubble Sort
  const steps = [
    {
      array: [5, 3, 8, 4, 2, 7, 1, 6],
      comparing: [0, 1],
      description: 'Comparamos 5 y 3. 5 es mayor que 3. Intercambian posición',
    },
    {
      array: [3, 5, 8, 4, 2, 7, 1, 6],
      comparing: [1, 2],
      description: 'Comparamos 5 y 8. 5 es menor que 8. No intercambian',
    },
    {
      array: [3, 5, 8, 4, 2, 7, 1, 6],
      comparing: [2, 3],
      description: 'Comparamos 8 y 4. 8 es mayor que 4. Intercambian posición',
    },
    {
      array: [3, 5, 4, 8, 2, 7, 1, 6],
      comparing: [3, 4],
      description: 'Comparamos 8 y 2. 8 es mayor que 2. Intercambian posición',
    },
    {
      array: [3, 5, 4, 2, 8, 7, 1, 6],
      comparing: [4, 5],
      description: 'Comparamos 8 y 7. 8 es mayor que 7. Intercambian posición',
    },
    {
      array: [3, 5, 4, 2, 7, 8, 1, 6],
      comparing: [5, 6],
      description: 'Comparamos 8 y 1. 8 es mayor que 1. Intercambian posición',
    },
    {
      array: [3, 5, 4, 2, 7, 1, 8, 6],
      comparing: [6, 7],
      description: 'Comparamos 8 y 6. 8 es mayor que 6. Intercambian posición',
    },
    {
      array: [3, 5, 4, 2, 7, 1, 6, 8],
      comparing: [],
      description: 'Primera pasada completa. El 8 está en su posición final',
    },
  ];

  const currentStepData = steps[currentStep];

  const getBarColor = (index) => {
    if (currentStepData.comparing.includes(index)) {
      return '#FFD700'; // Amarillo para elementos comparándose
    }
    return ['#FF6B6B', '#FFA500', '#FFD700', '#90EE90', '#4169E1', '#9370DB', '#FF69B4', '#00CED1'][index] || '#999';
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress((currentStep - 1) / steps.length);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress((currentStep + 1) / steps.length);
    } else {
      // Fin del algoritmo
      navigation.goBack();
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            setProgress((prev + 1) / steps.length);
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2000); // Cambiar cada 2 segundos
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  return (
    <LinearGradient colors={['#D5E6FF', '#E6F7FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#52328C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Algoritmos</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          {/* Título del algoritmo */}
          <Text style={styles.algorithmTitle}>{algorithmName}</Text>

          {/* Visualización de barras */}
          <View style={styles.visualizationContainer}>
            <View style={styles.barsContainer}>
              {currentStepData.array.map((value, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: value * 15,
                        backgroundColor: getBarColor(index),
                      },
                    ]}
                  >
                    <Text style={styles.barValue}>{value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Descripción del paso */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{currentStepData.description}</Text>
          </View>

          {/* Controles */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, currentStep === 0 && styles.controlButtonDisabled]}
              onPress={handlePrevious}
              disabled={currentStep === 0}
            >
              <Ionicons name="play-back" size={24} color="white" />
              <Text style={styles.controlButtonText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <Text style={styles.controlButtonText}>Siguiente</Text>
              <Ionicons name="play-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Indicador de paso */}
          <Text style={styles.stepIndicator}>
            Paso {currentStep + 1} de {steps.length}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
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
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  algorithmTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  visualizationContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
    minHeight: 250,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  descriptionContainer: {
    backgroundColor: '#E5F3FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#7C3FE0',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playButton: {
    backgroundColor: '#4169E1',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  stepIndicator: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});