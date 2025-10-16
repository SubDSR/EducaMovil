// src/screens/CursosScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ... (El resto de tus datos y componentes de CursosScreen no cambian)
const coursesData = [
    { id: '1', title: 'Tipos de datos', description: 'Aprende a guardar y usar diferentes tipos de datos', progress: 0, total: 25 },
    { id: '2', title: 'Estructuras de control', description: 'Controla acciones con if, else y ciclos repetitivos', progress: 0, total: 25 },
    { id: '3', title: 'Funciones', description: 'Crea funciones para simplificar y reutilizar instrucciones', progress: 0, total: 25 },
    { id: '4', title: 'Algoritmos', description: 'Secuencia de pasos para resolver un problema', progress: 0, total: 25 },
    { id: '5', title: 'Arreglos', description: 'Agrupa y organiza datos en arreglos', progress: 0, total: 25 },
];

const ProgressBar = ({ progress, total }) => {
    const progressPercent = total > 0 ? (progress / total) * 100 : 0;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    );
};
  
const CourseCard = ({ title, description, progress, total, navigation }) => ( // <-- Añade navigation aquí
  <TouchableOpacity
    style={styles.cardContainer}
    // Añadimos la lógica de navegación
    onPress={() => {
      if (title === 'Tipos de datos') {
        navigation.navigate('TiposDeDatos');
      }
    }}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <View style={styles.progressInfo}>
      <Text style={styles.sectionText}>SECCIÓN</Text>
      <Text style={styles.progressText}>{`${progress}/${total}`}</Text>
    </View>
    <ProgressBar progress={progress} total={total} />
  </TouchableOpacity>
);

export default function CursosScreen({ navigation }) { // <-- Asegúrate que navigation llegue aquí
  return (
    <LinearGradient colors={['#E6F7FF', '#D5E6FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cursos</Text>
        </View>

        <FlatList
          data={coursesData}
          // --- Pasamos la prop de navegación a cada tarjeta ---
          renderItem={({ item }) => <CourseCard {...item} navigation={navigation} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
// ... (El resto de los estilos no cambian)
const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    header: {
      backgroundColor: '#E6EEFF',
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 26,
      paddingTop: 40,
      paddingBottom: 20,
      fontFamily: 'Roboto_500Medium',
      color: '#333',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 80,
    },
    cardContainer: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 22,
      fontFamily: 'Oxanium_700Bold',
      marginBottom: 5,
    },
    cardDescription: {
      fontSize: 14,
      fontFamily: 'Oxanium_600SemiBold',
      color: '#666',
      marginBottom: 15,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    sectionText: {
      fontSize: 12,
      color: '#888',
      fontWeight: '600',
    },
    progressText: {
      fontSize: 12,
      color: '#888',
      fontWeight: '600',
    },
    progressBarContainer: {
      height: 20,
      backgroundColor: '#D7D7D7',
      borderRadius: 64,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#68B268',
      borderRadius: 64,
    },
  });