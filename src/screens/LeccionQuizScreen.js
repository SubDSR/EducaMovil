// src/screens/LeccionQuizScreen.js - VERSIÓN DEFINITIVA
// CON TALKBACK: Lectura completa + timer después
// SIN TALKBACK: Timer empieza inmediatamente (como antes)

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
  
  // ⚡ Estados por defecto: SIN pausa (para usuarios sin TalkBack)
  const [isPaused, setIsPaused] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [shouldBlockAccessibility, setShouldBlockAccessibility] = useState(false);
  
  // 🕐 Medición de tiempo real
  const startTime = useRef(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // ✅ 1. DETECCIÓN DE TALKBACK Y CONTROL INICIAL DEL TIMER
  useEffect(() => {
    const checkScreenReader = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(isEnabled);
      
      if (!isEnabled) {
        // ⚡ SIN TALKBACK: Timer empieza INMEDIATAMENTE (comportamiento original)
        console.log('🔵 SIN TalkBack: Timer empieza inmediatamente');
        setIsPaused(false);
        setShouldBlockAccessibility(false);
        startTime.current = Date.now();
      } else {
        // ✅ CON TALKBACK: Timer empieza PAUSADO (esperando lectura)
        console.log('🟢 CON TalkBack: Timer pausado, esperando lectura completa');
        setIsPaused(true);
        setShouldBlockAccessibility(true);
      }
    };
    checkScreenReader();
    
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setIsScreenReaderEnabled);
    return () => subscription.remove();
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

  // 🔊 2. LECTURA AUTOMÁTICA COMPLETA AL ENTRAR (SOLO CON TALKBACK)
  useEffect(() => {
    // ⚡ SOLO ejecuta esto si TalkBack está activo
    if (isScreenReaderEnabled && !hasPlayedIntro) {
      console.log('🔊 Iniciando lectura automática con TalkBack...');
      
      // Construimos el mensaje completo
      let messageToRead = `Quiz de ${lessonTitle}. `;
      messageToRead += `Pregunta: ${quizData.question}. `;
      messageToRead += "Las opciones son: ";
      
      quizData.options.forEach((opt, index) => {
        messageToRead += `Opción ${index + 1}: ${opt.text}. `;
      });

      messageToRead += "Selecciona una opción tocando dos veces sobre ella. ";
      messageToRead += "El cronómetro de 30 segundos comenzará después de este mensaje.";

      // 📊 CÁLCULO PRECISO DE DURACIÓN
      const wordCount = messageToRead.split(' ').length;
      const estimatedSeconds = Math.ceil(wordCount / 2.5);
      const estimatedDuration = (estimatedSeconds + 3) * 1000;
      
      console.log(`📊 Mensaje tiene ${wordCount} palabras`);
      console.log(`⏱️ Duración estimada: ${estimatedSeconds} segundos`);
      console.log(`🔒 Esperaremos: ${estimatedDuration / 1000} segundos`);

      // Reproducimos el mensaje completo
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(messageToRead);
        setHasPlayedIntro(true);

        // Después del mensaje, desbloqueamos y ACTIVAMOS el timer
        setTimeout(() => {
          console.log('✅ Lectura completa. Activando cronómetro...');
          setShouldBlockAccessibility(false);
          
          // 🎬 AQUÍ EMPIEZA EL CRONÓMETRO (solo con TalkBack)
          AccessibilityInfo.announceForAccessibility("El cronómetro ha comenzado. Tienes 30 segundos.");
          setIsPaused(false);
          
          // Reseteamos el tiempo inicial para medición correcta
          startTime.current = Date.now();
        }, estimatedDuration);
      }, 1500);
    }
  }, [isScreenReaderEnabled, hasPlayedIntro]);

  // Calcular tiempo transcurrido
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
      
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(
          `Seleccionaste: ${selectedOption?.text}. Presiona verificar para comprobar tu respuesta.`
        );
      }
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
      
      if (isScreenReaderEnabled) {
        setTimeout(() => {
          if (isCorrect) {
            AccessibilityInfo.announceForAccessibility(`¡Correcto! ${quizData.correctExplanation}`);
          } else {
            AccessibilityInfo.announceForAccessibility(`Incorrecto. ${quizData.incorrectExplanation}`);
          }
        }, 500);
      }
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
        
        {/* ⭐ OVERLAY DE LECTURA (solo si TalkBack está ON y estamos bloqueados) ⭐ */}
        {isScreenReaderEnabled && shouldBlockAccessibility && (
          <View
            style={styles.readingOverlay}
            accessible={true}
            accessibilityLabel="Escucha la pregunta y las opciones completas. El cronómetro comenzará después."
            accessibilityViewIsModal={true}
          >
          </View>
        )}

        {/* Header con temporizador */}
        <View 
          style={styles.header} 
          accessible={true} 
          accessibilityLabel={`Quiz de ${lessonTitle}`}
          importantForAccessibility={shouldBlockAccessibility && isScreenReaderEnabled ? "no-hide-descendants" : "yes"}
        >
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

          {/* ⏱️ TEMPORIZADOR */}
          <View>
            <TimerProgressBar 
              duration={30} 
              onComplete={handleTimeUp}
              isPaused={isPaused} 
            />
          </View>
        </View>

        {/* Contenido */}
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          importantForAccessibility={shouldBlockAccessibility && isScreenReaderEnabled ? "no-hide-descendants" : "auto"}
        >
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

        <View 
          style={styles.actionContainer}
          importantForAccessibility={shouldBlockAccessibility && isScreenReaderEnabled ? "no-hide-descendants" : "auto"}
        >
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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  
  // Overlay de lectura
  readingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    backgroundColor: 'transparent',
  },
  
  header: { backgroundColor: '#987ACC', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  closeButton: { padding: 5, marginRight: 15 },
  titleContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  questionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30 },
  robotQuestionImage: { width: 130, height: 130, resizeMode: 'contain' },
  speechBubble: { flex: 1, backgroundColor: '#FFC8F4', borderRadius: 20, borderWidth: 1, borderColor: '#5a5a5aff', padding: 20, elevation: 3 },
  questionText: { fontSize: 16, color: '#333', fontWeight: '600', lineHeight: 24 },
  answersSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  optionsContainer: { flex: 1, gap: 12 },
  optionButton: { backgroundColor: '#B0D4FF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', minHeight: 55, borderWidth: 2, borderColor: '#5a5a5aff', width: '100%' },
  optionButtonSelected: { backgroundColor: '#2B5A9E', borderWidth: 2, borderColor: '#1E3E6B' },
  optionButtonDisabled: { opacity: 0.5 },
  correctAnswer: { backgroundColor: '#4CAF50', borderColor: '#45A049' },
  incorrectAnswer: { backgroundColor: '#FF6B6B', borderColor: '#E55A5A' },
  robotAnswerImage: { width: 150, height: 150, resizeMode: 'contain' },
  robotFeedbackImage: { width: 150, height: 150, resizeMode: 'contain' },
  feedbackBubble: { borderRadius: 20, padding: 20, elevation: 3, marginTop: 10 },
  feedbackBubbleCorrect: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#5a5a5aff' },
  feedbackBubbleIncorrect: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#5a5a5aff' },
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