// src/screens/TiposDeDatosScreen.js - CON OCULTAMIENTO DE TABS
import React, { useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes reutilizables
import LevelNode from '../components/LevelNode';
import LessonBubble from '../components/LessonBubble';

// Imágenes
const robot3 = require('../../assets/img/robot-3.png');
const robot4 = require('../../assets/img/robot-4.png');
const robot5 = require('../../assets/img/robot-5.png');
const robot6 = require('../../assets/img/robot-6.png');
const robot7 = require('../../assets/img/robot-7.png');
const robot8 = require('../../assets/img/robot-8.png');

const nivelActualImage = require('../../assets/img/nivel-actual.png');

const TiposDeDatosScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  // ✅ OCULTAR TABS al entrar a esta pantalla
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' }, // Ocultar tabs
        swipeEnabled: false, // Deshabilitar swipe
      });
    }

    // ✅ MOSTRAR TABS al salir de esta pantalla
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            backgroundColor: '#52328C',
            height: 80,
            justifyContent: 'center',
          },
          swipeEnabled: false,
        });
      }
    };
  }, [navigation]);

  // Datos de las lecciones
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

  const handleLevelPress = (lesson) => {
    if (lesson.status === 'current') {
      setSelectedLevel(selectedLevel?.id === lesson.id ? null : lesson);
    } else if (lesson.status === 'unlocked') {
      startLesson(lesson);
    }
  };

  const startLesson = (lesson) => {
    setSelectedLevel(null);
    navigation.navigate('LeccionFlashcard', { 
      lessonTitle: lesson.title,
      lessonNumber: lesson.id 
    });
  };

  const getBubblePosition = (levelPosition) => {
    return {
      left: levelPosition.left - 100,
      top: levelPosition.top - 120,
    };
  };

  const handleGoBack = () => {
    navigation.navigate('Cursos');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="menu" size={24} color="white" />
          <Text style={styles.headerTitle}>Tipos de datos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Robots decorativos */}
        <Image source={robot3} style={[styles.robot, { left: 30, top: 170 }]} />
        <Image source={robot4} style={[styles.robot, { left: 30, top: 1370 }]} />
        <Image source={robot5} style={[styles.robot, { left: 30, top: 780 }]} />
        <Image source={robot6} style={[styles.robot, { left: 200, top: 450 }]} />
        <Image source={robot7} style={[styles.robot, { left: 200, top: 1080 }]} />
        <Image source={robot8} style={[styles.robot, { left: 200, top: 1630 }]} />

        {/* Burbuja de lección */}
        {selectedLevel && (
          <LessonBubble
            title={selectedLevel.title}
            lessonNumber={selectedLevel.id}
            onStart={() => startLesson(selectedLevel)}
            style={getBubblePosition(selectedLevel.position)}
          />
        )}

        {/* Niveles del camino de aprendizaje */}
        {lessons.map((lesson) => (
          <LevelNode
            key={lesson.id}
            status={lesson.status}
            style={lesson.position}
            onPress={() => handleLevelPress(lesson)}
          >
            {lesson.status === 'current' ? (
              <Image 
                source={nivelActualImage}  // Usamos la imagen de "nivel-actual.png"
                style={styles.levelImage}
              />
            ) : null}
          </LevelNode>
        ))}

        {/* Niveles adicionales bloqueados */}
        {[...Array(10)].map((_, index) => (
          <LevelNode
            key={`locked-${index + 11}`}
            status="locked"
            style={{ 
              left: [230, 140, 50, 90, 50, 140, 230, 190, 230, 140][index],
              top: 810 + (index * 90)
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D5E6FF',
  },
  header: {
    backgroundColor: '#987ACC',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52328C',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  container: {
    height: 2080,
    position: 'relative',
  },
  robot: {
    position: 'absolute',
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default TiposDeDatosScreen;