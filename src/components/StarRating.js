import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function StarRating({ stars, size = 24 }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map(i => (
        <Text
          key={i}
          style={[styles.star, { fontSize: size }, i <= stars ? styles.filled : styles.empty]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 4 },
  star: { lineHeight: undefined },
  filled: { color: COLORS.warning },
  empty: { color: COLORS.elevated },
});
