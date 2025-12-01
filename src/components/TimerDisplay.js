import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimerDisplay({ seconds, mode }) {
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
    return ((totalTime - seconds) / totalTime) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressRing}>
        <View style={[styles.progressBar, { height: `${getProgress()}%` }]} />
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: 0,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 1,
  },
});
