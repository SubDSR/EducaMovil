// src/components/TimerProgressBar.js - CON ANUNCIOS MEJORADOS
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';

const TimerProgressBar = ({ 
  duration = 30, 
  onComplete = () => {}, 
  isPaused = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(1);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const hasCompleted = useRef(false);
  const hasAnnounced20 = useRef(false);
  const hasAnnounced10 = useRef(false);
  const hasAnnounced5 = useRef(false);
  const hasAnnounced4 = useRef(false);
  const hasAnnounced3 = useRef(false);
  const hasAnnounced2 = useRef(false);
  const hasAnnounced1 = useRef(false);

  // 1. Detectar si TalkBack está activo
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
  }, []);

  // 2. Reset cuando cambia duración
  useEffect(() => {
    hasCompleted.current = false;
    hasAnnounced20.current = false;
    hasAnnounced10.current = false;
    hasAnnounced5.current = false;
    hasAnnounced4.current = false;
    hasAnnounced3.current = false;
    hasAnnounced2.current = false;
    hasAnnounced1.current = false;
    setTimeLeft(duration);
    setProgress(1);
  }, [duration]);

  // 3. Lógica del Intervalo
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            
            // Anunciar "Tiempo terminado"
            if (isScreenReaderEnabled) {
              AccessibilityInfo.announceForAccessibility("El tiempo se ha acabado");
            }
            
            // Delay para que se escuche el mensaje antes de cambiar pantalla
            setTimeout(() => {
              onComplete();
            }, 2000);
          }
          return 0;
        }
        
        const newTime = prev - 0.1;
        
        // --- ANUNCIOS DE VOZ ---
        if (isScreenReaderEnabled) {
          const currentSec = Math.floor(prev);
          const nextSec = Math.floor(newTime);

          // Detectar cuando cruzamos la frontera de un segundo
          if (currentSec !== nextSec) {
            // Anuncio a los 20 segundos
            if (nextSec === 20 && !hasAnnounced20.current) {
              hasAnnounced20.current = true;
              AccessibilityInfo.announceForAccessibility("Faltan 20 segundos");
            }
            // Anuncio a los 10 segundos
            else if (nextSec === 10 && !hasAnnounced10.current) {
              hasAnnounced10.current = true;
              AccessibilityInfo.announceForAccessibility("Faltan 10 segundos");
            }
            // Cuenta regresiva del 5 al 1
            else if (nextSec === 5 && !hasAnnounced5.current) {
              hasAnnounced5.current = true;
              AccessibilityInfo.announceForAccessibility("5");
            }
            else if (nextSec === 4 && !hasAnnounced4.current) {
              hasAnnounced4.current = true;
              AccessibilityInfo.announceForAccessibility("4");
            }
            else if (nextSec === 3 && !hasAnnounced3.current) {
              hasAnnounced3.current = true;
              AccessibilityInfo.announceForAccessibility("3");
            }
            else if (nextSec === 2 && !hasAnnounced2.current) {
              hasAnnounced2.current = true;
              AccessibilityInfo.announceForAccessibility("2");
            }
            else if (nextSec === 1 && !hasAnnounced1.current) {
              hasAnnounced1.current = true;
              AccessibilityInfo.announceForAccessibility("1");
            }
          }
        }
        // -------------------------------------------

        setProgress(newTime / duration);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, duration, isScreenReaderEnabled]);

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = Math.floor(safeSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View 
      style={styles.container}
      // Ocultamos del lector de pantalla para evitar que lea los números cambiantes
      importantForAccessibility={isScreenReaderEnabled ? "no-hide-descendants" : "auto"}
    >
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
      
      {/* El texto visual sigue ahí para quien ve */}
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