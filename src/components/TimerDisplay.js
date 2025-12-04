import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function TimerDisplay({ seconds, mode }) {
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
    return ((totalTime - seconds) / totalTime);
  };

  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = getProgress();
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={styles.container}>
      <View style={styles.progressRing}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            stroke="rgba(255, 255, 255, 0.1)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <Circle
            stroke="#4ECDC4"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 1,
  },
});
