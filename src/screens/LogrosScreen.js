// src/screens/LogrosScreen.js
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- 1. AÑADIMOS LAS MISIONES SEMANALES A LOS DATOS ---
const missions = {
  priority: [{ id: 'p1', text: 'Curso de Ciberseguridad', xp: '100 EXP/test' }],
  daily: [
    { id: 'd1', text: 'Completa un test con más del 80% de aciertos.', xp: '75 EXP' },
    { id: 'd2', text: 'Responde 15 preguntas correctamente.', xp: '75 EXP' },
  ],
  weekly: [
    { id: 'w1', text: 'Completa 15 tests', xp: '250 EXP' },
    { id: 'w2', text: 'Completa tests por 5 días consecutivos.', xp: '350 EXP' },
  ],
};

const XpBar = ({ progress, total }) => {
  const percent = total > 0 ? (progress / total) * 100 : 0;
  return (
    <View style={styles.xpBarContainer}>
      <View style={[styles.xpBarFill, { width: `${percent}%` }]} />
    </View>
  );
};

export default function LogrosScreen() {
  return (
    <LinearGradient colors={['#E6F7FF', '#D5E6FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.headerTitle}>Rango Bronce</Text>
          <View style={styles.card}>
            <View style={styles.rachaHeader}>
              <Text style={styles.cardText}>Racha</Text>
              <Text style={styles.cardText}>3 días</Text>
            </View>
            <View style={styles.diasContainer}>
              <Text style={styles.diaText}>Do</Text>
              <Ionicons name="flash" size={24} color="#FFA500" style={styles.diaIcon} />
              <Ionicons name="flash" size={24} color="#FFA500" style={styles.diaIcon} />
              <Ionicons name="flash" size={24} color="#FFA500" style={styles.diaIcon} />
              <Text style={styles.diaText}>Ju</Text>
              <Text style={styles.diaText}>Vi</Text>
              <Text style={styles.diaText}>Sa</Text>
            </View>
          </View>
          <Image source={require('../../assets/img/casco-reppo.png')} style={styles.avatar} />
          <View style={styles.xpContainer}>
            <XpBar progress={80} total={1000} />
            <View style={styles.xpTextContainer}>
              <Text style={styles.xpText}>80/1000 XP</Text>
              <Text style={styles.nextRankText}>Siguiente Rango Plata</Text>
            </View>
          </View>
          <Text style={styles.missionTitle}>Misión prioritaria</Text>
          {missions.priority.map((mission) => (
            <View key={mission.id} style={[styles.missionCard, styles.priorityMission]}>
              <Text style={styles.missionText}>{mission.text}</Text>
              <Text style={styles.missionXp}>{mission.xp}</Text>
            </View>
          ))}
          <Text style={styles.missionTitle}>Misiones diarias</Text>
          {missions.daily.map((mission) => (
            <View key={mission.id} style={styles.missionCard}>
              <Text style={styles.missionText}>{mission.text}</Text>
              <Text style={styles.missionXp}>{mission.xp}</Text>
            </View>
          ))}

          {/* --- 2. AÑADIMOS LA NUEVA SECCIÓN DE MISIONES SEMANALES --- */}
          <Text style={styles.missionTitle}>Misiones semanales</Text>
          {missions.weekly.map((mission) => (
            <View key={mission.id} style={styles.missionCard}>
              <Text style={styles.missionText}>{mission.text}</Text>
              <Text style={styles.missionXp}>{mission.xp}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Los estilos no necesitan cambios, ya que reutilizamos los existentes ---
const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100, // Espacio para la barra de pestañas
    },
    headerTitle: {
        fontSize: 24,
        paddingTop: 40,
        paddingBottom: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#C9CEFF',
        borderRadius: 16,
        padding: 15,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#5a5a5aff',
    },
    rachaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardText: {
        color: '#333',
        fontWeight: '600',
    },
    diasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#5a5a5aff',
    },
    diaText: {
        fontWeight: 'bold',
    },
    diaIcon: {},
    avatar: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    xpContainer: {
        width: '100%',
        marginBottom: 30,
    },
    xpBarContainer: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        width: '100%',
        borderWidth: 1,
        borderColor: '#5a5a5aff',
    },
    xpBarFill: {
        height: '100%',
        backgroundColor: '#FF00FF',
        borderRadius: 6,
    },
    xpTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    xpText: {
        color: '#333',
        fontWeight: 'bold',
    },
    nextRankText: {
        color: '#777',
    },
    missionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 15,
        marginTop: 10,
    },
    missionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#81CAFF',
        borderRadius: 12,
        padding: 15,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#5a5a5aff',
    },
    priorityMission: {
        backgroundColor: '#81CAFF',
        borderWidth: 1,
        borderColor: '#5a5a5aff',
    },
    missionText: {
        color: '#333',
        fontWeight: '600',
        flex: 1,
    },
    missionXp: {
        color: '#333',
        fontWeight: 'bold',
    },
});