// src/components/LessonBubble.js - CON FLECHA ALINEADA AL BOTÓN
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const LessonBubble = ({ 
  title, 
  lessonNumber, 
  onStart, 
  style,
  arrowPosition = 'top', // 'top' o 'bottom'
  arrowOffset = 0 // Desplazamiento horizontal de la flecha desde el centro
}) => {
  // Calcular la posición de la flecha (centro de la burbuja + offset)
  const arrowLeft = 140 + arrowOffset - 15; // 140 = mitad de 280px, -15 = mitad del ancho de la flecha
  
  return (
    <View style={[styles.container, style]}>
      {/* Flecha superior (cuando la burbuja está DEBAJO del botón) */}
      {arrowPosition === 'bottom' && (
        <View style={[styles.arrowTop, { left: arrowLeft }]} />
      )}
      
      <View style={styles.bubble}>
        <Text style={styles.title}>
          Lección {lessonNumber} - {title}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
      
      {/* Flecha inferior (cuando la burbuja está ENCIMA del botón) */}
      {arrowPosition === 'top' && (
        <View style={[styles.arrowBottom, { left: arrowLeft }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 280, // Ancho fijo para el contenedor
    zIndex: 10,
  },
  bubble: {
    backgroundColor: '#F1DBFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#A07CBC',
    padding: 20,
    width: 280,
    alignItems: 'center',
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }
    ),
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#A07CBC',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }
    ),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Flecha que apunta HACIA ABAJO (burbuja encima del botón)
  arrowBottom: {
    position: 'absolute',
    bottom: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#A07CBC',
    // left se aplicará dinámicamente
  },
  // Flecha que apunta HACIA ARRIBA (burbuja debajo del botón)
  arrowTop: {
    position: 'absolute',
    top: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#A07CBC',
    // left se aplicará dinámicamente
  },
});

export default LessonBubble;