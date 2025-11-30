import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const LessonBubble = ({ 
  title, 
  lessonNumber, 
  onStart, 
  style,
  arrowPosition = 'top', 
  arrowOffset = 0,
  // Nueva prop: permite ocultar este componente del lector de pantalla
  // cuando usamos el overlay gigante en la pantalla principal.
  isAccessibilityHidden = false 
}) => {
  const arrowLeft = 140 + arrowOffset - 15;
  
  return (
    <View 
      style={[styles.container, style]}
      // Importante: Si el overlay gigante está activo, esto se vuelve invisible para TalkBack
      importantForAccessibility={isAccessibilityHidden ? 'no-hide-descendants' : 'yes'}
      accessible={!isAccessibilityHidden}
    >
      {arrowPosition === 'bottom' && (
        <View style={[styles.arrowTop, { left: arrowLeft }]} />
      )}
      
      <View style={styles.bubble}>
        <Text style={styles.title}>
          Lección {lessonNumber} - {title}
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onStart}
          accessible={!isAccessibilityHidden} // Botón accesible solo si no hay overlay
          accessibilityLabel="Comenzar lección"
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
      
      {arrowPosition === 'top' && (
        <View style={[styles.arrowBottom, { left: arrowLeft }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 280,
    zIndex: 10,
  },
  bubble: {
    backgroundColor: '#F1DBFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#5e2f82ff',
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
    backgroundColor: '#5e2f82ff',
    borderRadius: 15,
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
    borderTopColor: '#5e2f82ff',
  },
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
    borderBottomColor: '#5e2f82ff',
  },
});

export default LessonBubble;