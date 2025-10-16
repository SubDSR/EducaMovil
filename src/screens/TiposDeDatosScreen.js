// src/screens/TiposDeDatosScreen.js
import React, { useState } from 'react'; // --- 1. Importamos useState
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// ... (las importaciones de imágenes no cambian)
import nivelDesbloqueado from '../../assets/img/nivel-desbloqueado.png';
import nivelActual from '../../assets/img/nivel-actual.png';
import nivelBloqueado from '../../assets/img/nivel-bloqueado.png';
import robot3 from '../../assets/img/robot-3.png';
import robot4 from '../../assets/img/robot-4.png';
import robot5 from '../../assets/img/robot-5.png';
import robot6 from '../../assets/img/robot-6.png';
import robot7 from '../../assets/img/robot-7.png';
import robot8 from '../../assets/img/robot-8.png';
import hamburguerMenu from '../../assets/img/hamburguer-menu.png';


// --- 2. Modificamos el componente para aceptar un `onPress` ---
const Level = ({ style, status, onPress }) => {
  let imageSource = nivelBloqueado;
  if (status === 'unlocked') {
    imageSource = nivelDesbloqueado;
  } else if (status === 'current') {
    imageSource = nivelActual;
  }

  // TouchableOpacity ya nos da un efecto visual al presionar (se opaca ligeramente)
  return (
    <TouchableOpacity style={[styles.level, style]} onPress={onPress} activeOpacity={0.7}>
      <Image source={imageSource} style={styles.levelImage} />
    </TouchableOpacity>
  );
};

export default function TiposDeDatosScreen({ navigation }) {
  // --- 3. Creamos un estado para controlar la visibilidad de la burbuja ---
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={hamburguerMenu} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Tipos de datos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Robots */}
        <Image source={robot3} style={[styles.robot, { left: 30, top: 240 }]} />
        <Image source={robot4} style={[styles.robot, { left: 30, top: 1440 }]} />
        <Image source={robot5} style={[styles.robot, { left: 30, top: 850 }]} />
        <Image source={robot6} style={[styles.robot, { left: 200, top: 520 }]} />
        <Image source={robot7} style={[styles.robot, { left: 200, top: 1150 }]} />
        <Image source={robot8} style={[styles.robot, { left: 200, top: 1700 }]} />

        {/* --- 4. Renderizamos la burbuja solo si isBubbleVisible es true --- */}
        {isBubbleVisible && (
          <View style={styles.speechBubbleContainer}>
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleTitle}>Lección 5 - Conversión de tipos</Text>
              <TouchableOpacity style={styles.bubbleButton}>
                <Text style={styles.bubbleButtonText}>Comenzar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bubbleArrow} />
          </View>
        )}

        {/* Niveles */}
        <Level status="unlocked" style={{ left: 50, top: 90 }} />
        <Level status="unlocked" style={{ left: 140, top: 150 }} />
        <Level status="unlocked" style={{ left: 230, top: 210 }} />
        <Level status="unlocked" style={{ left: 190, top: 300 }} />
        
        {/* --- 5. Añadimos el `onPress` para cambiar el estado --- */}
        <Level
          status="current"
          style={{ left: 230, top: 390 }}
          onPress={() => setIsBubbleVisible(!isBubbleVisible)} // Al presionar, invierte la visibilidad
        />
        
        <Level status="locked" style={{ left: 140, top: 450 }} />
        <Level status="locked" style={{ left: 50, top: 510 }} />
        <Level status="locked" style={{ left: 90, top: 600 }} />
        <Level status="locked" style={{ left: 50, top: 690 }} />
        <Level status="locked" style={{ left: 140, top: 750 }} />
        <Level status="locked" style={{ left: 230, top: 810 }} />
        <Level status="locked" style={{ left: 190, top: 900 }} />
        <Level status="locked" style={{ left: 230, top: 990 }} />
        <Level status="locked" style={{ left: 140, top: 1050 }} />
        <Level status="locked" style={{ left: 50, top: 1110 }} />
        <Level status="locked" style={{ left: 90, top: 1200 }} />
        <Level status="locked" style={{ left: 50, top: 1290 }} />
        <Level status="locked" style={{ left: 140, top: 1350 }} />
        <Level status="locked" style={{ left: 230, top: 1410 }} />
        <Level status="locked" style={{ left: 190, top: 1500 }} />
        <Level status="locked" style={{ left: 230, top: 1590 }} />
        <Level status="locked" style={{ left: 140, top: 1650 }} />
        <Level status="locked" style={{ left: 50, top: 1710 }} />
        <Level status="locked" style={{ left: 90, top: 1800 }} />
        <Level status="locked" style={{ left: 50, top: 1890 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Los estilos no cambian)
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#D5E6FF',
    },
    header: {
      backgroundColor: '#987ACC',
      paddingTop: 40,
      paddingBottom: 10,
      paddingHorizontal: 15,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#52328C',
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 15,
      alignSelf: 'flex-start',
    },
    headerIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    headerTitle: {
      color: 'white',
      fontSize: 20,
      fontFamily: 'Oxanium_700Bold',
    },
    container: {
      height: 2080, // Altura suficiente para todos los elementos
    },
    robot: {
      position: 'absolute',
      width: 150,
      height: 150,
      resizeMode: 'contain',
    },
    level: {
      position: 'absolute',
    },
    levelImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },
    speechBubbleContainer: {
      position: 'absolute',
      top: 390 - 100, // Posiciona el globo encima del nivel 5 (current)
      left: 230 - 30,
      alignItems: 'center',
      zIndex: 10,
    },
    speechBubble: {
      backgroundColor: '#F1DBFF',
      borderRadius: 20,
      borderWidth: 3,
      borderColor: '#A07CBC',
      padding: 15,
      width: 240,
      alignItems: 'center',
    },
    bubbleTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    bubbleButton: {
      backgroundColor: '#A07CBC',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 25,
    },
    bubbleButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    bubbleArrow: {
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