// src/components/TimerProgressBar.js - VERSIÓN CORREGIDA (Sin error de setState)
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimerProgressBar = ({ 
  duration = 30, 
  onComplete = () => {}, 
  isPaused = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(1);
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Reset cuando cambia la duración
    hasCompleted.current = false;
    setTimeLeft(duration);
    setProgress(1);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          
          // Llamar a onComplete solo una vez y en el siguiente tick
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            setTimeout(() => {
              onComplete();
            }, 0);
          }
          
          return 0;
        }
        
        const newTime = prev - 0.1;
        setProgress(newTime / duration);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, duration]); // Removido onComplete de las dependencias

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: progress > 0.3 ? '#68B268' : '#FF6B6B'
            }
          ]} 
        />
      </View>
      <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    minWidth: 40,
  },
});

export default TimerProgressBar;