import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { LEVELS, isLevelUnlocked } from '../utils/levels';
import { ALGORITHMS } from '../utils/algorithms';
import { loadProgress } from '../utils/storage';
import StarRating from '../components/StarRating';

export default function LevelSelectScreen({ navigation }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const p = await loadProgress();
      setProgress(p || {});
    });
    return unsubscribe;
  }, [navigation]);

  const worlds = [...new Set(LEVELS.map(l => l.world))];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Level Select</Text>

      {worlds.map(world => (
        <View key={world} style={styles.worldSection}>
          <Text style={styles.worldTitle}>
            World {world}: {LEVELS.find(l => l.world === world)?.worldName}
          </Text>
          <Text style={styles.worldAlgo}>
            {ALGORITHMS[LEVELS.find(l => l.world === world)?.algorithm]?.name}
          </Text>
          <View style={styles.levelGrid}>
            {LEVELS
              .filter(l => l.world === world)
              .map(level => {
                const unlocked = isLevelUnlocked(level.id, progress);
                const stars = progress[level.id]?.stars || 0;

                return (
                  <TouchableOpacity
                    key={level.id}
                    style={[styles.levelButton, !unlocked && styles.locked]}
                    onPress={() => {
                      if (unlocked) navigation.navigate('Game', { levelId: level.id });
                    }}
                  >
                    <Text style={[styles.levelId, !unlocked && styles.lockedText]}>
                      {level.id}
                    </Text>
                    {unlocked && stars > 0 && (
                      <StarRating stars={stars} size={12} />
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 24 },
  worldSection: { marginBottom: 32 },
  worldTitle: { fontSize: 20, fontWeight: '600', color: COLORS.primaryLight },
  worldAlgo: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 12, marginTop: 2 },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  levelButton: {
    width: 64,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  locked: { opacity: 0.4 },
  levelId: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary },
  lockedText: { color: COLORS.textSecondary },
});
