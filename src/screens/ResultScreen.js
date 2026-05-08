import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { LEVELS } from '../utils/levels';
import StarRating from '../components/StarRating';

const TOTAL_LEVELS = LEVELS.length;

export default function ResultScreen({ route, navigation }) {
  const {
    levelId, won, stars, score, timeLeft,
    totalSwaps, wrongSwaps, optimalSwaps, levelName, algorithm,
  } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.algorithmLabel}>{algorithm}</Text>
      <Text style={styles.title}>{won ? 'Level Clear!' : 'Time\'s Up!'}</Text>

      <StarRating stars={stars} size={48} />

      <View style={styles.stats}>
        <StatRow label="Score" value={score} />
        <StatRow label="Time Left" value={`${timeLeft}s`} />
        <StatRow label="Total Swaps" value={totalSwaps} />
        <StatRow label="Wrong Swaps" value={wrongSwaps} />
        <StatRow label="Optimal" value={optimalSwaps} />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (won && levelId < TOTAL_LEVELS) {
              navigation.replace('Game', { levelId: levelId + 1 });
            } else {
              navigation.replace('Game', { levelId });
            }
          }}
        >
          <Text style={styles.primaryText}>
            {won && levelId < TOTAL_LEVELS ? 'Next Level' : 'Retry'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('LevelSelect')}
        >
          <Text style={styles.secondaryText}>Level Select</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.secondaryText}>Main Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatRow({ label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 24,
  },
  algorithmLabel: { fontSize: 14, color: COLORS.accent, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 36, fontWeight: 'bold', color: COLORS.textPrimary },
  stats: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    gap: 12,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 16, color: COLORS.textSecondary },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  buttons: { width: '100%', gap: 12 },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryText: { color: COLORS.textSecondary, fontSize: 16 },
});
