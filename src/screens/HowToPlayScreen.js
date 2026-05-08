import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { ALGORITHMS } from '../utils/algorithms';
import AlgorithmInfoCard from '../components/AlgorithmInfoCard';

const SECTIONS = [
  { key: 'rules', label: 'Game Rules' },
  ...Object.keys(ALGORITHMS).map(k => ({ key: k, label: ALGORITHMS[k].name })),
];

export default function HowToPlayScreen({ navigation }) {
  const [activeSection, setActiveSection] = useState('rules');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabs}>
          {SECTIONS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={[styles.tab, activeSection === s.key && styles.tabActive]}
              onPress={() => setActiveSection(s.key)}
            >
              <Text style={[styles.tabText, activeSection === s.key && styles.tabTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'rules' ? <RulesContent /> : <AlgorithmContent algorithmKey={activeSection} />}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function RulesContent() {
  return (
    <View style={styles.rulesContainer}>
      <RuleStep number={1} text="Look at the scrambled array of bars. Each bar has a number and a height." />
      <RuleStep number={2} text="Your goal: sort the bars from smallest (left) to largest (right)." />
      <RuleStep number={3} text="The catch: you must sort them following a specific algorithm's step-by-step logic." />
      <RuleStep number={4} text="Tap one bar to select it (it glows yellow). Then tap another bar to swap them." />
      <RuleStep number={5} text="If the swap matches the algorithm's next step, the bars flash green. If not, they shake red and you lose 5 seconds." />
      <RuleStep number={6} text="Sort all bars before the timer runs out to win the level." />

      <View style={styles.rulesNote}>
        <Text style={styles.rulesNoteTitle}>Learning the algorithms</Text>
        <Text style={styles.rulesNoteText}>
          Each world teaches a different sorting algorithm. The first level of each world is a tutorial that highlights the correct bars to swap. Use the tabs above to read about each algorithm before you play.
        </Text>
      </View>

      <View style={styles.rulesNote}>
        <Text style={styles.rulesNoteTitle}>Scoring</Text>
        <Text style={styles.rulesNoteText}>
          +10 per correct swap, time bonus (remaining secs × 2), efficiency bonus, and +25 for zero wrong swaps. 3 stars for a near-perfect run.
        </Text>
      </View>
    </View>
  );
}

function RuleStep({ number, text }) {
  return (
    <View style={styles.ruleStep}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

function AlgorithmContent({ algorithmKey }) {
  return <AlgorithmInfoCard algorithmKey={algorithmKey} detailed />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  tabsScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.elevated,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  rulesContainer: {
    gap: 16,
    paddingBottom: 32,
  },
  ruleStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  rulesNote: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  rulesNoteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
  },
  rulesNoteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: COLORS.elevated,
    borderRadius: 8,
    marginVertical: 24,
  },
  backText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
