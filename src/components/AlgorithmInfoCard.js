import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { ALGORITHMS } from '../utils/algorithms';

const GUIDES = {
  bubble: {
    howItWorks: 'Repeatedly steps through the array, comparing adjacent elements and swapping them if they are in the wrong order. Larger values "bubble" to the end of the array.',
    playerTip: 'The tallest unsorted bar will move right one step at a time. Look for adjacent bars where the left one is taller than the right one.',
    pattern: 'Large values → right, pass by pass',
  },
  selection: {
    howItWorks: 'Divides the array into a sorted and unsorted section. Each pass finds the smallest value in the unsorted section and swaps it to the front of that section.',
    playerTip: 'Find the shortest bar in the unsorted area (right side). It needs to swap to the front of the unsorted section. Any two bars can be swapped.',
    pattern: 'Find minimum → swap to front',
  },
  insertion: {
    howItWorks: 'Builds the sorted array one element at a time by taking the next unsorted element and shifting it left into its correct position among the already-sorted elements.',
    playerTip: 'Look at the first unsorted bar. If it\'s smaller than the bar to its left, they need to swap. Keep shifting it left until it\'s in the right place.',
    pattern: 'Pick element → shift left into place',
  },
  merge: {
    howItWorks: 'Recursively splits the array into halves until each piece is one element, then merges them back together in sorted order by bubbling elements from the right half leftward into place.',
    playerTip: 'During a merge, elements from the right half need to bubble left past larger elements from the left half. Watch for adjacent swaps where a smaller bar needs to move left.',
    pattern: 'Split → merge sorted halves',
  },
  quick: {
    howItWorks: 'Selects a "pivot" element and partitions the array so all smaller elements go left and all larger go right. The pivot is now in its final position. Recursively sorts each partition.',
    playerTip: 'The pivot element swaps to the middle — smaller bars on its left, larger on its right. Any two bars can be swapped. Focus on which bar is the current pivot.',
    pattern: 'Choose pivot → partition around it',
  },
};

const difficultyColors = {
  Easy: COLORS.success,
  Medium: COLORS.warning,
  Hard: COLORS.error,
  Expert: COLORS.purple,
};

export default function AlgorithmInfoCard({ algorithmKey, detailed = false }) {
  const algo = ALGORITHMS[algorithmKey];
  const guide = GUIDES[algorithmKey];
  if (!algo || !guide) return null;

  return (
    <View style={[styles.card, detailed && styles.cardDetailed]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: difficultyColors[algo.difficulty] }]}>
          {algo.name}
        </Text>
        <Text style={[styles.difficulty, { backgroundColor: difficultyColors[algo.difficulty] + '33', color: difficultyColors[algo.difficulty] }]}>
          {algo.difficulty}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>How it works</Text>
      <Text style={styles.description}>{guide.howItWorks}</Text>

      <Text style={styles.sectionTitle}>Player tip</Text>
      <Text style={styles.description}>{guide.playerTip}</Text>

      <View style={styles.patternRow}>
        <Text style={styles.patternLabel}>Pattern: </Text>
        <Text style={styles.patternValue}>{guide.pattern}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardDetailed: {
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  patternValue: {
    fontSize: 13,
    color: COLORS.accent,
    fontStyle: 'italic',
  },
});
