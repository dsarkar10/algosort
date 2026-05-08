import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Text style={styles.logo}>AlgoSort</Text>
        <Text style={styles.subtitle}>Sort like a computer</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LevelSelect')}
      >
        <Text style={styles.buttonText}>PLAY NOW</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.purple }]}
        onPress={() => navigation.navigate('PatternSelect')}
      >
        <Text style={styles.buttonText}>PATTERNS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('HowToPlay')}>
        <Text style={styles.secondaryText}>HOW TO PLAY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 32,
  },
  logoSection: { alignItems: 'center' },
  logo: { fontSize: 48, fontWeight: 'bold', color: COLORS.textPrimary, letterSpacing: 2 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 8 },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  secondaryText: { color: COLORS.textSecondary, fontSize: 16 },
});
