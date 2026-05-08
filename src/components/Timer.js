import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Timer({ seconds }) {
  const color = seconds <= 10 ? COLORS.error : COLORS.accent;
  return (
    <Text style={[styles.timer, { color }]} allowFontScaling={false}>
      {formatTime(seconds)}
    </Text>
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
