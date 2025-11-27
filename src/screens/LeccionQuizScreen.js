// src/screens/LeccionQuizScreen.js - CON TEMPORIZADOR Y TIEMPO REAL
import React, { useState, useEffect, useRef } from 'react';
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

import TimerProgressBar from '../components/TimerProgressBar';

const robot = require('../../assets/img/robot-4.png');
const robotBlue = require('../../assets/img/robot-5.png');

const LeccionQuizScreen = ({ navigation, route }) => {
  const { lessonTitle = 'Tipos de datos', lessonNumber = 1 } = route.params || {};
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // 🕐 Medición de tiempo real
  const startTime = useRef(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Datos del quiz
  const quizData = {
    question: '¿Qué tipo de números pueden almacenarse en una variable de tipo float?',
    options: [
      { id: 1, text: 'Enteros', isCorrect: false },
      { id: 2, text: 'Decimales', isCorrect: true },
      { id: 3, text: 'Negativos', isCorrect: false },
    ],
    correctExplanation: 'Un float se usa para guardar números con decimales, como 3.14 o -0.5.',
    incorrectExplanation: 'Incorrecto. Un float se usa para guardar números con decimales.',
  };

  // Calcular tiempo transcurrido cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showFeedback && !isPaused) {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showFeedback, isPaused]);

  const handleSelectAnswer = (optionId) => {
    if (!showFeedback) {
      setSelectedAnswer(optionId);
    }
  };

  const handleVerify = () => {
    if (selectedAnswer) {
      // Calcular tiempo final al momento de verificar
      const finalTime = Math.floor((Date.now() - startTime.current) / 1000);
      setElapsedTime(finalTime);
      setShowFeedback(true);
      setIsPaused(true);
    }
  };

  const handleNext = () => {
    const isCorrect = quizData.options.find(opt => opt.id === selectedAnswer)?.isCorrect;
    
    navigation.navigate('LeccionFeedback', {
      lessonTitle,
      lessonNumber,
      isCorrect,
      stats: { 
        aciertos: isCorrect ? 1 : 0, 
        rapidez: `${elapsedTime}s`, // ✅ TIEMPO REAL
        errores: isCorrect ? 0 : 1 
      },
    });
  };

  const handleTimeUp = () => {
    // Si se acaba el tiempo sin responder
    if (!showFeedback) {
      const finalTime = Math.floor((Date.now() - startTime.current) / 1000);
      setElapsedTime(finalTime);
      handleNext();
    }
  };

  const getButtonStyle = (optionId) => {
    if (!showFeedback) {
      return selectedAnswer === optionId ? styles.optionButtonSelected : styles.optionButton;
    }

    const option = quizData.options.find(opt => opt.id === optionId);
    if (option?.isCorrect) {
      return [styles.optionButton, styles.correctAnswer];
    }
    if (selectedAnswer === optionId && !option?.isCorrect) {
      return [styles.optionButton, styles.incorrectAnswer];
    }
    return [styles.optionButton, styles.optionButtonDisabled];
  };

  const getButtonTextStyle = (optionId) => {
    if (showFeedback) {
      const option = quizData.options.find(opt => opt.id === optionId);
      if (option?.isCorrect || selectedAnswer === optionId) {
        return styles.optionTextLight;
      }
    }
    return selectedAnswer === optionId ? styles.optionTextLight : styles.optionText;
  };

  return (
    <LinearGradient colors={['#D5E6FF', '#E6F7FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header con temporizador */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#52328C" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{lessonTitle}</Text>
              <Text style={styles.headerSubtitle}>Introducción</Text>
            </View>
          </View>

          {/* ⏱️ TEMPORIZADOR - Solo en Quiz */}
          <TimerProgressBar 
            duration={30} 
            onComplete={handleTimeUp}
            isPaused={isPaused}
          />
        </View>

        {/* Contenido */}
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Robot con pregunta */}
          <View style={styles.questionContainer}>
            <Image source={robot} style={styles.robotImage} />
            <View style={styles.speechBubble}>
              <Text style={styles.questionText}>{quizData.question}</Text>
            </View>
          </View>

          {/* Opciones */}
          <View style={styles.optionsContainer}>
            {quizData.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={getButtonStyle(option.id)}
                onPress={() => handleSelectAnswer(option.id)}
                disabled={showFeedback}
                activeOpacity={0.7}
              >
                <Text style={getButtonTextStyle(option.id)}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback con robot azul */}
          {showFeedback && (
            <View style={styles.feedbackContainer}>
              <Image source={robotBlue} style={styles.feedbackRobot} />
            </View>
          )}
        </ScrollView>

        {/* Botón de acción */}
        <View style={styles.actionContainer}>
          {!showFeedback ? (
            <TouchableOpacity
              style={[styles.verifyButton, !selectedAnswer && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              disabled={!selectedAnswer}
            >
              <Text style={styles.verifyButtonText}>Verificar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={32} color="white" />
            </TouchableOpacity>
          )}
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  robotImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: -10,
  },
  speechBubble: {
    backgroundColor: '#FFC8F4',
    borderRadius: 20,
    padding: 20,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#B0D4FF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#2B5A9E',
    borderColor: '#1E3E6B',
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionTextLight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  correctAnswer: {
    backgroundColor: '#4CAF50',
    borderColor: '#45A049',
  },
  incorrectAnswer: {
    backgroundColor: '#FF6B6B',
    borderColor: '#E74C3C',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  feedbackRobot: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#7C3FE0',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default LeccionQuizScreen;