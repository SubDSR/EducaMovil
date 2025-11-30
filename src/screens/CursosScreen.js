// src/screens/CursosScreen.js - SIN MODIFICACIÓN DE TABS
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CursosScreen = ({ navigation }) => {
  // ❌ ELIMINADO: useLayoutEffect que modificaba tabBarStyle

  const cursos = [
    {
      id: 1,
      nombre: 'Tipos de datos',
      descripcion: 'Aprende a guardar y usar diferentes tipos de datos',
      progreso: 4,
      total: 25,
      color: '#68B268',
      screen: 'TiposDeDatos',
    },
    {
      id: 2,
      nombre: 'Estructuras de control',
      descripcion: 'Controla acciones con if, else y ciclos repetitivos',
      progreso: 0,
      total: 25,
      color: '#B0D4FF',
      screen: 'EstructurasControl',
      disabled: true,
    },
    {
      id: 3,
      nombre: 'Funciones',
      descripcion: 'Crea funciones para simplificar y reutilizar instrucciones',
      progreso: 0,
      total: 25,
      color: '#B0D4FF',
      screen: 'Funciones',
      disabled: true,
    },
    {
      id: 4,
      nombre: 'Algoritmos',
      descripcion: 'Secuencia de pasos para resolver un problema',
      progreso: 0,
      total: 25,
      color: '#B0D4FF',
      screen: 'VisualizadorAlgoritmos',
      disabled: true,
    },
    {
      id: 5,
      nombre: 'Arreglos',
      descripcion: 'Organiza datos en listas ordenadas',
      progreso: 0,
      total: 25,
      color: '#B0D4FF',
      screen: 'Arreglos',
      disabled: true,
    },
  ];

  const handleCursoPress = (curso) => {
    if (!curso.disabled) {
      navigation.navigate(curso.screen);
    }
  };

  return (
    <LinearGradient colors={['#B0ADFF', '#CCFAFF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cursos</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {cursos.map((curso) => (
            <TouchableOpacity
              key={curso.id}
              style={[
                styles.cursoCard,
                curso.disabled && styles.cursoCardDisabled,
              ]}
              onPress={() => handleCursoPress(curso)}
              disabled={curso.disabled}
            >
              <View style={styles.cursoHeader}>
                <Text style={styles.cursoNombre}>{curso.nombre}</Text>
                {curso.disabled && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
              </View>

              <Text style={styles.cursoDescripcion}>{curso.descripcion}</Text>

              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>SECCIÓN</Text>
                <Text style={styles.progressText}>
                  {curso.progreso}/{curso.total}
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(curso.progreso / curso.total) * 100}%`,
                      backgroundColor: curso.color,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
      fontSize: 28,
      paddingTop: 35,
      fontWeight: 'bold',
      color: '#333',
  },
  container: {
    padding: 20,
    paddingBottom: 100, // Espacio para los tabs
  },
  cursoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#000000ff',
  },
  cursoCardDisabled: {
    opacity: 0.6,
  },
  cursoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cursoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E0220',
    flex: 1,
  },
  lockBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 4,
  },
  lockIcon: {
    fontSize: 16,
  },
  cursoDescripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
    paddingRight: 50,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default CursosScreen;