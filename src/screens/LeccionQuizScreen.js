// src/screens/LeccionQuizScreen.js
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import TimerProgressBar from '../components/TimerProgressBar';

// Robots
const robotQuestion = require('../../assets/img/robot-9.png');
const robotAnswer = require('../../assets/img/robot-10.png');
const robotFeedback = require('../../assets/img/robot-11.png');
const perfilButton = require('../../assets/img/perfil-button.png');

const LeccionQuizScreen = ({ navigation, route }) => {
  const { lessonTitle = 'Tipos de datos', lessonNumber = 1 } = route.params || {};
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Estado de pausa
  const [isPaused, setIsPaused] = useState(false); 
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  
  // 🕐 Medición de tiempo real
  const startTime = useRef(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // ✅ 1. DETECCIÓN Y SECUENCIA DE ACCESIBILIDAD
  useEffect(() => {
    const setupAccessibility = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(isEnabled);

      if (isEnabled) {
        // A) SI HAY TALKBACK: Pausamos el timer INMEDIATAMENTE
        setIsPaused(true);

        // 1. Anuncio inicial
        AccessibilityInfo.announceForAccessibility(
          `Quiz de ${lessonTitle}. Escucha la pregunta y las opciones. El tiempo de 30 segundos comenzará después.`
        );
        
        // 2. Leer pregunta (a los 3s)
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(`Pregunta: ${quizData.question}`);
        }, 3000);

        // 3. Leer opciones (a los 7s)
        setTimeout(() => {
          const optionsText = quizData.options.map((opt, idx) => 
            `Opción ${idx + 1}: ${opt.text}`
          ).join('. ');
          AccessibilityInfo.announceForAccessibility(optionsText);
        }, 7000);

        // 4. INICIAR EL TIEMPO (a los 13s - ajusta este tiempo según la longitud de tu texto)
        setTimeout(() => {
          // Anunciamos el inicio
          AccessibilityInfo.announceForAccessibility("¡Ahora! Tienes 30 segundos.");
          // Desbloqueamos el timer
          setIsPaused(false); 
          // Reseteamos la marca de tiempo para que el cálculo de "rapidez" sea justo
          startTime.current = Date.now(); 
        }, 13000);

      } else {
        // B) SI NO HAY TALKBACK: El timer corre normal
        setIsPaused(false);
      }
    };

    setupAccessibility();
  }, []);

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

  // 🚫 BLOQUEAR BOTÓN DE RETROCESO
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "¿Seguro que quieres salir?",
        "No se guardará tu progreso.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", onPress: () => navigation.navigate('TiposDeDatos'), style: "destructive" }
        ]
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
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

  // Calcular tiempo transcurrido (para estadísticas)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showFeedback && !isPaused) {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setElapsedTime(Math.max(0, elapsed));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showFeedback, isPaused]);

  const handleSelectAnswer = (optionId) => {
    if (!showFeedback) {
      const selectedOption = quizData.options.find(opt => opt.id === optionId);
      setSelectedAnswer(optionId);
      AccessibilityInfo.announceForAccessibility(
        `Seleccionaste: ${selectedOption?.text}. Presiona verificar para comprobar tu respuesta.`
      );
    }
  };

  const handleVerify = () => {
    if (selectedAnswer) {
      const finalTime = Math.floor((Date.now() - startTime.current) / 1000);
      setElapsedTime(Math.max(0, finalTime));
      setShowFeedback(true);
      setIsPaused(true); // Pausamos timer al verificar

      const selectedOption = quizData.options.find(opt => opt.id === selectedAnswer);
      const isCorrect = selectedOption?.isCorrect;
      
      setTimeout(() => {
        if (isCorrect) {
          AccessibilityInfo.announceForAccessibility(`¡Correcto! ${quizData.correctExplanation}`);
        } else {
          AccessibilityInfo.announceForAccessibility(`Incorrecto. ${quizData.incorrectExplanation}`);
        }
      }, 500);
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
      setElapsedTime(30);
      // El anuncio de "Tiempo terminado" ya lo hace el TimerProgressBar
      handleNext();
    }
  };

  const handleClose = () => {
    Alert.alert(
      "¿Seguro que quieres salir?",
      "No se guardará tu progreso.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: () => navigation.navigate('TiposDeDatos'), style: "destructive" }
      ]
    );
  };

  const getButtonStyle = (optionId) => {
    if (!showFeedback) {
      return [styles.optionButton, selectedAnswer === optionId && styles.optionButtonSelected];
    }
    const option = quizData.options.find(opt => opt.id === optionId);
    if (option?.isCorrect) return [styles.optionButton, styles.correctAnswer];
    if (selectedAnswer === optionId && !option?.isCorrect) return [styles.optionButton, styles.incorrectAnswer];
    return [styles.optionButton, styles.optionButtonDisabled];
  };

  const getButtonTextStyle = (optionId) => {
    const baseStyle = { fontSize: 16, fontWeight: '600' };
    if (showFeedback) {
      const option = quizData.options.find(opt => opt.id === optionId);
      if (option?.isCorrect || selectedAnswer === optionId) return { ...baseStyle, color: '#FFFFFF' };
      return { ...baseStyle, color: '#333' };
    }
    return selectedAnswer === optionId ? { ...baseStyle, color: '#FFFFFF' } : { ...baseStyle, color: '#333' };
  };

  const isCorrect = showFeedback && quizData.options.find(opt => opt.id === selectedAnswer)?.isCorrect;

  return (
    <LinearGradient colors={['#D5E6FF', '#E6F7FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} accessible={false}>
        {/* Header con temporizador */}
        <View style={styles.header} accessible={true} accessibilityLabel={`Quiz de ${lessonTitle}`}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.closeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cerrar quiz"
            >
              <Ionicons name="close" size={28} color="#52328C" />
            </TouchableOpacity>
            <View style={styles.titleContainer} accessible={false}>
              <Text style={styles.headerTitle}>{lessonTitle}</Text>
              <Text style={styles.headerSubtitle}>Introducción</Text>
            </View>
          </View>

          {/* ⏱️ TEMPORIZADOR
              Nota: Dentro de TimerProgressBar ya ocultamos el texto para accesibilidad 
              si TalkBack está activo, así que ya no leerá cada segundo.
          */}
          <View>
            <TimerProgressBar 
              duration={30} 
              onComplete={handleTimeUp}
              isPaused={isPaused} 
            />
          </View>
        </View>

        {/* Contenido */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionRow}>
            <Image source={robotQuestion} style={styles.robotQuestionImage} accessible={true} accessibilityLabel="Robot instructor" />
            <View style={styles.speechBubble} accessible={true} accessibilityRole="text" accessibilityLabel={`Pregunta: ${quizData.question}`}>
              <Text style={styles.questionText}>{quizData.question}</Text>
            </View>
          </View>

          <View style={styles.answersSection}>
            <View style={styles.optionsContainer}>
              {quizData.options.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={getButtonStyle(option.id)}
                  onPress={() => handleSelectAnswer(option.id)}
                  disabled={showFeedback}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Opción ${index + 1}: ${option.text}`}
                  accessibilityState={{ selected: selectedAnswer === option.id, disabled: showFeedback }}
                >
                  <Text style={getButtonTextStyle(option.id)}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {!showFeedback ? (
              <Image source={robotAnswer} style={styles.robotAnswerImage} accessible={true} accessibilityLabel="Robot esperando respuesta" />
            ) : (
              <Image source={robotFeedback} style={styles.robotFeedbackImage} accessible={true} accessibilityLabel={isCorrect ? "Robot celebrando" : "Robot corrigiendo"} />
            )}
          </View>

          {showFeedback && (
            <View style={[styles.feedbackBubble, isCorrect ? styles.feedbackBubbleCorrect : styles.feedbackBubbleIncorrect]} accessible={true} accessibilityRole="alert">
              <View style={styles.feedbackHeader}>
                <Ionicons name={isCorrect ? "checkmark-circle" : "close-circle"} size={24} color={isCorrect ? "#4CAF50" : "#FF6B6B"} />
                <Text style={[styles.feedbackTitle, isCorrect ? styles.feedbackTitleCorrect : styles.feedbackTitleIncorrect]}>
                  {isCorrect ? "Respuesta correcta" : "Respuesta incorrecta"}
                </Text>
              </View>
              <Text style={styles.feedbackExplanation}>{isCorrect ? quizData.correctExplanation : quizData.incorrectExplanation}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.actionContainer}>
          {!showFeedback ? (
            <TouchableOpacity
              style={[styles.verifyButton, !selectedAnswer && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              disabled={!selectedAnswer}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Verificar respuesta"
              accessibilityState={{ disabled: !selectedAnswer }}
            >
              <Text style={styles.verifyButtonText}>Verificar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={handleNext} 
              style={styles.nextButtonContainer}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Continuar"
            >
               <Image source={perfilButton} style={styles.nextButtonImage} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// ... Styles igual que antes
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: { backgroundColor: '#987ACC', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  closeButton: { padding: 5, marginRight: 15 },
  titleContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  questionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30 },
  robotQuestionImage: { width: 130, height: 130, resizeMode: 'contain', marginRight: -30 },
  speechBubble: { flex: 1, backgroundColor: '#FFC8F4', borderRadius: 20, padding: 20, elevation: 3 },
  questionText: { fontSize: 16, color: '#333', fontWeight: '600', lineHeight: 24 },
  answersSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  optionsContainer: { flex: 1, gap: 12 },
  optionButton: { backgroundColor: '#B0D4FF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', minHeight: 55, borderWidth: 2, borderColor: 'transparent', width: '100%' },
  optionButtonSelected: { backgroundColor: '#2B5A9E', borderColor: '#1E3E6B' },
  optionButtonDisabled: { opacity: 0.5 },
  correctAnswer: { backgroundColor: '#4CAF50', borderColor: '#45A049' },
  incorrectAnswer: { backgroundColor: '#FF6B6B', borderColor: '#E55A5A' },
  robotAnswerImage: { width: 150, height: 150, resizeMode: 'contain', marginLeft: -30 },
  robotFeedbackImage: { width: 150, height: 150, resizeMode: 'contain', marginLeft: -30 },
  feedbackBubble: { borderRadius: 20, padding: 20, elevation: 3, marginTop: 10 },
  feedbackBubbleCorrect: { backgroundColor: '#E8F5E9' },
  feedbackBubbleIncorrect: { backgroundColor: '#FFEBEE' },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  feedbackTitleCorrect: { color: '#4CAF50' },
  feedbackTitleIncorrect: { color: '#FF6B6B' },
  feedbackExplanation: { fontSize: 14, color: '#333', lineHeight: 22 },
  actionContainer: { paddingHorizontal: 20, paddingVertical: 20, borderTopWidth: 1, borderTopColor: 'rgba(0, 0, 0, 0.1)', alignItems: 'center' },
  verifyButton: { backgroundColor: '#7C3FE0', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center' },
  verifyButtonDisabled: { backgroundColor: '#CCCCCC' },
  verifyButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  nextButtonContainer: { justifyContent: 'center', alignItems: 'center', width: '100%' },
  nextButtonImage: { width: 70, height: 70, resizeMode: 'contain' },
});

export default LeccionQuizScreen;