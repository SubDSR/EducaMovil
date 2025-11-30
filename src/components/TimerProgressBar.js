// src/components/TimerProgressBar.js
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

  // 1. Detectar si TalkBack está activo
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
  }, []);

  // 2. Reset cuando cambia duración
  useEffect(() => {
    hasCompleted.current = false;
    setTimeLeft(duration);
    setProgress(1);
  }, [duration]);

  // 3. Lógica del Intervalo
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // --- LÓGICA DE AVISOS DE VOZ ---
        if (isScreenReaderEnabled && prev > 0) {
           const nextVal = prev - 0.1;
           
           // Usamos Math.floor para detectar el cambio de segundo entero
           // Ejemplo: Si pasamos de 20.05 (floor 20) a 19.95 (floor 19) -> Cruzamos la frontera
           const currentSec = Math.floor(prev); // ej: 20
           const nextSec = Math.floor(nextVal); // ej: 19

           if (currentSec !== nextSec) {
             // Acabamos de entrar en un nuevo segundo (nextSec)
             
             if (nextSec === 20) {
               AccessibilityInfo.announceForAccessibility("Quedan 20 segundos");
             } else if (nextSec === 10) {
               AccessibilityInfo.announceForAccessibility("Quedan 10 segundos");
             } else if (nextSec <= 5 && nextSec > 0) {
               // Cuenta regresiva 5, 4, 3, 2, 1
               AccessibilityInfo.announceForAccessibility(`${nextSec}`);
             } else if (nextSec === 0) {
               AccessibilityInfo.announceForAccessibility("Tiempo terminado");
             }
           }
        }
        // -------------------------------------------

        if (prev <= 0) {
          clearInterval(interval);
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            // Delay mínimo para asegurar que se escuche "Tiempo terminado" antes de cambiar pantalla
            setTimeout(() => {
              onComplete();
            }, 1000); 
          }
          return 0;
        }
        
        const newTime = prev - 0.1;
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
      // TRUCO IMPORTANTE: 
      // Si TalkBack está activado, ocultamos este contenedor de la accesibilidad.
      // Así evitamos que TalkBack lea "29, 28, 27..." cada vez que cambia el número visualmente.
      // Nosotros controlamos los anuncios manualmente con announceForAccessibility.
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
      
      {/* El texto visual sigue ahí para quien ve, pero TalkBack lo ignora si está activado */}
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