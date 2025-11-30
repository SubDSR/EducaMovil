import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LevelNode = ({ 
  status = 'locked', 
  style, 
  onPress,
  showPlayIcon = false,
  accessibilityLabel
}) => {
  const getNodeImage = () => {
    switch (status) {
      case 'unlocked': return require('../../assets/img/nivel-desbloqueado.png');
      case 'current': return require('../../assets/img/nivel-actual.png');
      default: return require('../../assets/img/nivel-bloqueado.png');
    }
  };

  const isInteractive = status !== 'locked';

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress} 
      activeOpacity={isInteractive ? 0.7 : 1}
      disabled={!isInteractive}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `Nivel ${status}`}
    >
      <Image source={getNodeImage()} style={styles.image} resizeMode="contain" />
      {status === 'current' && showPlayIcon && (
        <View style={styles.playIconContainer}>
          <Ionicons name="play" size={32} color="#68B268" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  playIconContainer: {
    position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' } : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }),
  },
});

export default LevelNode;