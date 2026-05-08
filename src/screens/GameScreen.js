import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { getLevel } from '../utils/levels';
import { generateShuffledArray } from '../utils/algorithms';
import { loadProgress, saveProgress } from '../utils/storage';
import BarChart from '../components/BarChart';
import Timer from '../components/Timer';
import AlgorithmInfoCard from '../components/AlgorithmInfoCard';

const WRONG_PENALTY = 5;

export default function GameScreen({ route, navigation }) {
  const { levelId } = route.params;
  const level = getLevel(levelId);
  const algo = level.algorithmConfig;

  const [array, setArray] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(level.time);
  const [step, setStep] = useState(0);
  const [totalWrongSwaps, setTotalWrongSwaps] = useState(0);
  const [barStates, setBarStates] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const stepsRef = useRef([]);
  const timerRef = useRef(null);

  const initGame = useCallback(() => {
    const arr = generateShuffledArray(level.arraySize);
    const swaps = algo.precomputeSteps(arr);
    stepsRef.current = swaps;
    setArray(arr);
    setStep(0);
    setTimeLeft(level.time);
    setSelectedIndex(null);
    setTotalWrongSwaps(0);
    setBarStates(arr.map(() => ({ color: COLORS.primary, isShaking: false, locked: false })));
    setGameState('playing');
    setFeedbackMessage('');
  }, [level, algo]);

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') {
      handleGameOver();
    }
  }, [gameState]);

  function handleGameOver() {
    const stepsTotal = stepsRef.current.length;
    const done = step;
    const totalSwaps = step + totalWrongSwaps;
    const isWin = gameState === 'won';

    const maxScore = level.time * 2 + 50 + 25;
    const swapScore = done * 10;
    const wrongPenalty = totalWrongSwaps * 5;
    const timeBonus = timeLeft * 2;
    const efficiency = stepsTotal > 0 ? Math.round((stepsTotal / totalSwaps) * 50) : 0;
    const noWrongBonus = totalWrongSwaps === 0 ? 25 : 0;

    let score = swapScore - wrongPenalty + timeBonus + efficiency + noWrongBonus;
    score = Math.max(0, Math.round(score));

    let stars = 0;
    if (isWin) stars = 1;
    const ratio = score / maxScore;
    if (isWin && ratio >= 0.7) stars = 2;
    if (isWin && ratio >= 0.95) stars = 3;

    saveResult(levelId, stars, score, timeLeft, step, totalWrongSwaps, stepsTotal);
  }

  async function saveResult(id, stars, score, time, swaps, wrongSwaps, optimal) {
    const progress = await loadProgress();
    const existing = progress[id];
    if (!existing || stars > existing.stars || score > existing.score) {
      progress[id] = { completed: stars > 0, stars, score, time, swaps, wrongSwaps, optimal };
      await saveProgress(progress);
    }
    navigation.replace('Result', {
      levelId: id,
      won: gameState === 'won',
      stars,
      score,
      timeLeft: time,
      totalSwaps: swaps,
      wrongSwaps,
      optimalSwaps: optimal,
      levelName: level.worldName,
      algorithm: algo.name,
    });
  }

  function handleBarPress(index) {
    if (gameState !== 'playing') return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    const idx1 = selectedIndex;
    const idx2 = index;

    if (algo.adjacentOnly && Math.abs(idx1 - idx2) !== 1) {
      setFeedbackMessage('Bars must be adjacent!');
      setSelectedIndex(null);
      return;
    }

    const steps = stepsRef.current;
    if (step >= steps.length) return;

    const expected = steps[step];
    const [ei1, ei2] = expected.indices;

    const lowIdx = Math.min(idx1, idx2);
    const highIdx = Math.max(idx1, idx2);

    if (lowIdx === ei1 && highIdx === ei2) {
      handleCorrectSwap(lowIdx, highIdx);
    } else {
      handleWrongSwap(lowIdx, highIdx);
    }
  }

  function handleCorrectSwap(idx1, idx2) {
    const newArray = [...array];
    [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
    setArray(newArray);

    const newBarStates = [...barStates];
    newBarStates[idx1] = { color: COLORS.success, isShaking: false, locked: false };
    newBarStates[idx2] = { color: COLORS.success, isShaking: false, locked: false };
    setBarStates(newBarStates);

    const newStep = step + 1;
    setStep(newStep);
    setSelectedIndex(null);
    setFeedbackMessage('Correct!');

    setTimeout(() => {
      setBarStates(newArray.map(() => ({ color: COLORS.primary, isShaking: false, locked: false })));
      setFeedbackMessage('');
    }, 400);

    const steps = stepsRef.current;
    if (newStep >= steps.length) {
      setGameState('won');
    } else if (level.tutorial) {
      setTimeout(() => {
        const nextStep = steps[newStep];
        if (nextStep) {
          const hintStates = newArray.map((_, i) => ({
            color: nextStep.indices.includes(i) ? COLORS.warning : COLORS.primary,
            isShaking: false,
            locked: false,
          }));
          setBarStates(hintStates);
          setTimeout(() => {
            setBarStates(newArray.map(() => ({ color: COLORS.primary, isShaking: false, locked: false })));
          }, 1200);
        }
      }, 500);
    }
  }

  function handleWrongSwap(idx1, idx2) {
    const newBarStates = [...barStates];
    newBarStates[idx1] = { color: COLORS.error, isShaking: true, locked: false };
    newBarStates[idx2] = { color: COLORS.error, isShaking: true, locked: false };
    setBarStates(newBarStates);
    setSelectedIndex(null);
    setTotalWrongSwaps(prev => prev + 1);
    setTimeLeft(prev => Math.max(0, prev - WRONG_PENALTY));
    setFeedbackMessage('Wrong! -5s');

    setTimeout(() => {
      setBarStates(array.map(() => ({ color: COLORS.primary, isShaking: false, locked: false })));
      setFeedbackMessage('');
    }, 600);
  }

  const progress = stepsRef.current.length > 0
    ? `${step}/${stepsRef.current.length}`
    : `0/0`;

  const difficultyColors = {
    Easy: COLORS.success,
    Medium: COLORS.warning,
    Hard: COLORS.error,
    Expert: COLORS.purple,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelLabel}>Level {levelId}</Text>
        <Timer seconds={timeLeft} />
        <Text style={styles.progress}>Swaps: {progress}</Text>
      </View>

      <View style={styles.algorithmLabel}>
        <Text style={[styles.algName, { color: difficultyColors[algo.difficulty] || COLORS.accent }]}>
          {algo.name}
        </Text>
        <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.algDifficulty}>{algo.difficulty}</Text>

      <View style={styles.board}>
        <BarChart
          array={array}
          selectedIndex={selectedIndex}
          onSelectBar={handleBarPress}
          barStates={barStates}
        />
      </View>

      {feedbackMessage ? (
        <Text style={[styles.feedback, {
          color: feedbackMessage === 'Correct!' ? COLORS.success : COLORS.error
        }]}>
          {feedbackMessage}
        </Text>
      ) : (
        <Text style={styles.hint}>
          {selectedIndex !== null
            ? (algo.adjacentOnly ? 'Tap an adjacent bar to swap' : 'Tap another bar to swap')
            : 'Tap a bar to select it'}
        </Text>
      )}

      <TouchableOpacity
        style={styles.pauseButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.pauseText}>QUIT</Text>
      </TouchableOpacity>

      <Modal visible={showHelp} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Algorithm Help</Text>
              <TouchableOpacity onPress={() => setShowHelp(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <AlgorithmInfoCard algorithmKey={algo.key} detailed />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
  },
  levelLabel: { fontSize: 20, fontWeight: '600', color: COLORS.textSecondary },
  progress: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary },
  algorithmLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 6, gap: 8 },
  algName: { fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  helpButton: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.elevated, justifyContent: 'center', alignItems: 'center',
  },
  helpButtonText: { color: COLORS.accent, fontSize: 14, fontWeight: 'bold' },
  algDifficulty: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 4 },
  board: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedback: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 16,
  },
  pauseButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: COLORS.elevated,
    borderRadius: 8,
    marginBottom: 16,
  },
  pauseText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
  modalClose: { fontSize: 20, color: COLORS.textSecondary, padding: 4 },
});
