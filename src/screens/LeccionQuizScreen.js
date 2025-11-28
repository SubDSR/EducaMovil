// src/screens/LeccionQuizScreen.js - ROBOTS A LOS LADOS
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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

// Robots
const robotQuestion = require('../../assets/img/robot-9.png'); // Robot izquierdo (pregunta)
const robotAnswer = require('../../assets/img/robot-10.png'); // Robot derecho (alternativas)
const robotFeedback = require('../../assets/img/robot-11.png'); // Robot celebrando

const LeccionQuizScreen = ({ navigation, route }) => {
  const { lessonTitle = 'Tipos de datos', lessonNumber = 1 } = route.params || {};
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // 🕐 Medición de tiempo real
  const startTime = useRef(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

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

  // Datos del quiz
  const quizData = {
    question: '¿Qué tipo de números pueden almacenarse en una variable de tipo float?',
    options: [
      { id: 1, text: 'Enteros', isCorrect: false },
      { id: 2, text: 'Decimales', isCorrect: true },
      { id: 3, text: 'Negativos', isCorrect: false },
    ],
    correctExplanation: 'Un float se usa para guardar números con decimales. Aunque también puede almacenar enteros, está pensado para manejar valores decimales.',
    incorrectExplanation: 'Un float se usa para guardar números con decimales. Aunque también puede almacenar enteros, está pensado para manejar valores decimales.',
  };

  // Calcular tiempo transcurrido
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
        rapidez: `${elapsedTime}s`,
        errores: isCorrect ? 0 : 1 
      },
    });
  };

  const handleTimeUp = () => {
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
    // ✅ MISMO TAMAÑO siempre (16px, bold)
    const baseStyle = {
      fontSize: 16,
      fontWeight: '600',
    };
    
    if (showFeedback) {
      const option = quizData.options.find(opt => opt.id === optionId);
      if (option?.isCorrect || selectedAnswer === optionId) {
        return { ...baseStyle, color: '#FFFFFF' };
      }
      return { ...baseStyle, color: '#333' };
    }
    
    // Antes de verificar: mismo tamaño, solo cambia color
    return selectedAnswer === optionId 
      ? { ...baseStyle, color: '#FFFFFF' }
      : { ...baseStyle, color: '#333' };
  };

  const isCorrect = showFeedback && quizData.options.find(opt => opt.id === selectedAnswer)?.isCorrect;

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

          {/* ⏱️ TEMPORIZADOR */}
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
          {/* Pregunta con robot-9 a la IZQUIERDA */}
          <View style={styles.questionRow}>
            <Image source={robotQuestion} style={styles.robotQuestionImage} />
            <View style={styles.speechBubble}>
              <Text style={styles.questionText}>{quizData.question}</Text>
            </View>
          </View>

          {/* Opciones con robot-10 a la DERECHA */}
          <View style={styles.answersSection}>
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

            {!showFeedback ? (
              <Image source={robotAnswer} style={styles.robotAnswerImage} />
            ) : (
              <Image source={robotFeedback} style={styles.robotFeedbackImage} />
            )}
          </View>

          {/* Feedback */}
          {showFeedback && (
            <View style={[
              styles.feedbackBubble, 
              isCorrect ? styles.feedbackBubbleCorrect : styles.feedbackBubbleIncorrect
            ]}>
              <View style={styles.feedbackHeader}>
                <Ionicons 
                  name={isCorrect ? "checkmark-circle" : "close-circle"} 
                  size={24} 
                  color={isCorrect ? "#4CAF50" : "#FF6B6B"} 
                />
                <Text style={[
                  styles.feedbackTitle,
                  isCorrect ? styles.feedbackTitleCorrect : styles.feedbackTitleIncorrect
                ]}>
                  {isCorrect ? "Respuesta correcta" : "Respuesta incorrecta"}
                </Text>
              </View>
              
              <Text style={styles.feedbackExplanation}>
                {isCorrect ? quizData.correctExplanation : quizData.incorrectExplanation}
              </Text>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  // ✅ Pregunta con robot a la IZQUIERDA
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  robotQuestionImage: {
    width: 100,  // ✅ Más grande (antes 80)
    height: 100,
    resizeMode: 'contain',
    marginRight: 10,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#FFC8F4',
    borderRadius: 20,
    padding: 20,
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
    lineHeight: 24,
  },
  // ✅ Opciones con robot a la DERECHA
  answersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 1,
    gap: 12,
    marginRight: 10,
  },
  optionButton: {
    backgroundColor: '#B0D4FF',
    borderRadius: 16,
    paddingVertical: 16, // ✅ Padding fijo
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55, // ✅ Altura mínima fija
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
  // ✅ Estilos de texto simplificados (ya no se usan directamente)
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
  robotAnswerImage: {
    width: 120,  // ✅ Más grande (antes 90)
    height: 120,
    resizeMode: 'contain',
  },
  robotFeedbackImage: {
    width: 120,  // ✅ Más grande (antes 90)
    height: 120,
    resizeMode: 'contain',
  },
  feedbackBubble: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  feedbackBubbleCorrect: {
    backgroundColor: '#E8F5E9',
  },
  feedbackBubbleIncorrect: {
    backgroundColor: '#FFEBEE',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  feedbackTitleCorrect: {
    color: '#4CAF50',
  },
  feedbackTitleIncorrect: {
    color: '#FF6B6B',
  },
  feedbackExplanation: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
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