// src/components/LessonBubble.js - OPTIMIZADO PARA WEB Y MOBILE
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const LessonBubble = ({ 
  title, 
  lessonNumber, 
  onStart, 
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.bubble}>
        <Text style={styles.title}>
          Lección {lessonNumber} - {title}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
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
  arrow: {
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
    marginTop: -3,
  },
});

export default LessonBubble;