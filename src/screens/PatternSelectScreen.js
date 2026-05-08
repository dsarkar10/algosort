import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { PATTERNS, LEVELS } from '../patterns/patternsData';
import { loadProgress } from '../utils/storage';
import StarRating from '../components/StarRating';

export default function PatternSelectScreen({ navigation }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const p = await loadProgress();
      setProgress(p || {});
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Algorithm Patterns</Text>
      <Text style={styles.subtitle}>Master coding interview patterns step by step</Text>

      {PATTERNS.map(pattern => {
        const levels = LEVELS.filter(l => l.pattern === pattern.key);
        const completed = levels.filter(l => progress[l.id]?.completed);
        const totalStars = levels.reduce((s, l) => s + (progress[l.id]?.stars || 0), 0);

        return (
          <TouchableOpacity
            key={pattern.key}
            style={[styles.patternCard, { borderLeftColor: pattern.color }]}
            onPress={() => navigation.navigate('PatternGame', { pattern: pattern.key, levelIndex: 0 })}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.patternIcon, { color: pattern.color }]}>{pattern.icon}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.patternName}>{pattern.name}</Text>
                <Text style={styles.patternDesc}>{pattern.desc}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.levelCount}>{completed.length}/{levels.length} levels</Text>
              {totalStars > 0 && (
                <StarRating stars={Math.min(3, Math.ceil(totalStars / levels.length))} size={14} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  patternCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    gap: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  patternIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  patternName: { fontSize: 17, fontWeight: '600', color: COLORS.textPrimary },
  patternDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelCount: { fontSize: 13, color: COLORS.textSecondary },
});
