import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';
import { COLORS, BAR } from '../constants/theme';

export default function BarChart({ array, selectedIndex, onSelectBar, barStates }) {
  const heightsRef = useRef(null);
  const shakesRef = useRef(null);
  const scalesRef = useRef(null);

  if (array.length > 0) {
    if (!heightsRef.current || heightsRef.current.length !== array.length) {
      heightsRef.current = array.map(() => new Animated.Value(0));
      shakesRef.current = array.map(() => new Animated.Value(0));
      scalesRef.current = array.map(() => new Animated.Value(1));
    }
  }

  const heights = heightsRef.current || [];
  const shakes = shakesRef.current || [];
  const scales = scalesRef.current || [];

  const barWidth = Math.max(30, Math.min(60, 280 / array.length));

  useEffect(() => {
    if (array.length === 0) return;
    array.forEach((value, i) => {
      const targetHeight = BAR.minHeight + ((value - 10) / 89) * (BAR.maxHeight - BAR.minHeight);
      if (heights[i]) {
        Animated.spring(heights[i], {
          toValue: targetHeight,
          useNativeDriver: false,
          friction: 6,
          tension: 40,
        }).start();
      }
    });
  }, [array]);

  useEffect(() => {
    if (barStates.length === 0) return;
    barStates.forEach((state, i) => {
      if (state.isShaking && shakes[i]) {
        Animated.sequence([
          Animated.timing(shakes[i], { toValue: 10, duration: 50, useNativeDriver: false }),
          Animated.timing(shakes[i], { toValue: -10, duration: 50, useNativeDriver: false }),
          Animated.timing(shakes[i], { toValue: 10, duration: 50, useNativeDriver: false }),
          Animated.timing(shakes[i], { toValue: 0, duration: 50, useNativeDriver: false }),
        ]).start();
      }
      const targetScale = i === selectedIndex ? 1.08 : 1;
      if (scales[i]) {
        Animated.spring(scales[i], {
          toValue: targetScale,
          useNativeDriver: false,
          friction: 6,
          tension: 60,
        }).start();
      }
    });
  }, [selectedIndex, barStates]);

  if (array.length === 0) return null;

  return (
    <View style={styles.container}>
      {array.map((value, i) => {
        const isSelected = i === selectedIndex;
        const state = barStates[i] || {};
        const barColor = state.color || (isSelected ? COLORS.warning : COLORS.primary);

        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onPress={() => onSelectBar(i)}
            style={styles.barWrapper}
          >
            <Text style={[styles.barValue, { color: COLORS.textPrimary }]} allowFontScaling={false}>
              {value}
            </Text>
            <Animated.View
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: heights[i] || 0,
                  backgroundColor: barColor,
                  transform: [
                    { translateX: shakes[i] || 0 },
                    { scaleY: scales[i] || 1 },
                  ],
                  opacity: state.locked ? 0.6 : 1,
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: BAR.gap,
    paddingHorizontal: 16,
    height: BAR.maxHeight + 30,
  },
  barWrapper: {
    alignItems: 'center',
  },
  barValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  bar: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
