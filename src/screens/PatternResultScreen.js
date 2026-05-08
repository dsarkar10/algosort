import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import StarRating from '../components/StarRating';

export default function PatternResultScreen({ route, navigation }) {
  const {
    pattern, levelId, won, stars, score, timeLeft,
    totalSwaps, wrongSwaps, optimalSwaps, levelName,
    hasNext, nextLevelIndex,
  } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.algoLabel}>{levelName}</Text>
      <Text style={styles.title}>{won ? 'Level Clear!' : 'Time\'s Up!'}</Text>

      <StarRating stars={stars} size={48} />

      <View style={styles.stats}>
        <StatRow label="Score" value={score} />
        <StatRow label="Steps Done" value={`${totalSwaps}/${optimalSwaps}`} />
        <StatRow label="Wrong Moves" value={wrongSwaps} />
        <StatRow label="Time Left" value={`${timeLeft}s`} />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            if (won && hasNext) {
              navigation.replace('PatternGame', { pattern, levelIndex: nextLevelIndex });
            } else {
              navigation.replace('PatternGame', { pattern, levelIndex: Math.max(0, nextLevelIndex - 1) });
            }
          }}
        >
          <Text style={styles.primaryText}>
            {won && hasNext ? 'Next Level' : 'Retry'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('PatternSelect')}>
          <Text style={styles.secondaryText}>All Patterns</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.popToTop()}>
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
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 20 },
  algoLabel: { fontSize: 14, color: COLORS.accent, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 36, fontWeight: 'bold', color: COLORS.textPrimary },
  stats: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, width: '100%', gap: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 16, color: COLORS.textSecondary },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  buttons: { width: '100%', gap: 12 },
  primaryBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' },
  secondaryBtn: { paddingVertical: 12, alignItems: 'center' },
  secondaryText: { color: COLORS.textSecondary, fontSize: 16 },
});
