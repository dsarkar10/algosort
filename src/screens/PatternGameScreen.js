import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { LEVELS, PATTERNS } from '../patterns/patternsData';
import { loadProgress, saveProgress } from '../utils/storage';
import Timer from '../components/Timer';
import StarRating from '../components/StarRating';
import {
  TwoPointersView, BinarySearchView, HashingView,
  SlidingWindowView, IntervalsView, BFSDFSView,
  DPView, HeapView,
} from '../patterns/PatternViews';

const VIEWS = {
  twoPointers: TwoPointersView,
  binarySearch: BinarySearchView,
  hashing: HashingView,
  slidingWindow: SlidingWindowView,
  intervals: IntervalsView,
  bfsdfs: BFSDFSView,
  dp: DPView,
  heap: HeapView,
};

const WRONG_PENALTY = 5;

export default function PatternGameScreen({ route, navigation }) {
  const { pattern: patternKey, levelIndex } = route.params;
  const pattern = PATTERNS.find(p => p.key === patternKey);
  const patternLevels = LEVELS.filter(l => l.pattern === patternKey);
  const levelIndexClamped = Math.min(levelIndex, patternLevels.length - 1);
  const level = patternLevels[levelIndexClamped];

  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 + level.steps.length * 10);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const timerRef = useRef(null);

  const startTime = useRef(30 + level.steps.length * 10);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setGameState('lost'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') handleGameOver();
  }, [gameState]);

  function handleCorrect(step) {
    const next = stepIndex + 1;
    setStepIndex(next);
    setFeedbackMessage('');
    if (next >= level.steps.length) {
      setGameState('won');
    }
  }

  function handleWrong() {
    setWrongCount(prev => prev + 1);
    setTimeLeft(prev => Math.max(0, prev - WRONG_PENALTY));
    setFeedbackMessage('Wrong! -5s');
    setTimeout(() => setFeedbackMessage(''), 600);
  }

  function handleGameOver() {
    const totalSteps = level.steps.length;
    const done = Math.min(stepIndex, totalSteps);
    const isWin = gameState === 'won';
    const maxScore = startTime.current * 2 + 50 + 25;
    const stepScore = done * 10;
    const wrongPenalty = wrongCount * 5;
    const timeBonus = timeLeft * 2;
    const efficiency = done > 0 ? Math.round((done / (done + wrongCount)) * 50) : 0;
    const noWrongBonus = wrongCount === 0 ? 25 : 0;
    let score = Math.max(0, Math.round(stepScore - wrongPenalty + timeBonus + efficiency + noWrongBonus));
    let stars = 0;
    if (isWin) stars = 1;
    const ratio = score / maxScore;
    if (isWin && ratio >= 0.7) stars = 2;
    if (isWin && ratio >= 0.95) stars = 3;

    saveAndGo(level.id, stars, score, done, wrongCount, totalSteps);
  }

  async function saveAndGo(id, stars, score, done, wrong, total) {
    const progress = await loadProgress();
    const existing = progress[id];
    if (!existing || stars > existing.stars || score > existing.score) {
      progress[id] = { completed: stars > 0, stars, score, time: timeLeft, swaps: done, wrongSwaps: wrong, optimal: total };
      await saveProgress(progress);
    }
    navigation.replace('PatternResult', {
      pattern: patternKey,
      levelId: id,
      won: gameState === 'won',
      stars, score, timeLeft,
      totalSwaps: done,
      wrongSwaps: wrong,
      optimalSwaps: total,
      levelName: pattern.name,
      algorithm: pattern.name,
      hasNext: levelIndexClamped + 1 < patternLevels.length,
      nextLevelIndex: levelIndexClamped + 1,
    });
  }

  const ViewComponent = VIEWS[patternKey];
  const done = Math.min(stepIndex, level.steps.length);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelLabel}>{pattern.name}</Text>
        <Timer seconds={timeLeft} />
        <Text style={styles.progress}>{done}/{level.steps.length}</Text>
      </View>

      <View style={styles.gameArea}>
        {ViewComponent && stepIndex < level.steps.length && (
          <ViewComponent
            level={level}
            stepIndex={stepIndex}
            steps={level.steps}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />
        )}
        {stepIndex >= level.steps.length && (
          <View style={styles.doneBox}>
            <Text style={styles.doneIcon}>✓</Text>
            <Text style={styles.doneText}>All steps complete!</Text>
          </View>
        )}
      </View>

      {feedbackMessage ? (
        <Text style={[styles.feedback, { color: COLORS.error }]}>{feedbackMessage}</Text>
      ) : (
        <Text style={styles.hint}>{done >= level.steps.length ? 'Complete!' : 'Follow the algorithm step by step'}</Text>
      )}

      <View style={styles.footer}>
        <StarRating stars={starsPreview(stepIndex, level.steps.length, wrongCount)} size={16} />
        <TouchableOpacity style={styles.quitBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.quitText}>QUIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function starsPreview(step, total, wrong) {
  if (step < total || total === 0) return 0;
  if (wrong === 0) return 3;
  if (wrong <= 2) return 2;
  return 1;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 },
  levelLabel: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary },
  progress: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary, fontFamily: 'monospace' },
  gameArea: { flex: 1, justifyContent: 'center' },
  feedback: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginVertical: 8, paddingHorizontal: 20 },
  hint: { textAlign: 'center', fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', marginVertical: 8, paddingHorizontal: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24 },
  quitBtn: { paddingVertical: 10, paddingHorizontal: 24, backgroundColor: COLORS.elevated, borderRadius: 8 },
  quitText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
});
