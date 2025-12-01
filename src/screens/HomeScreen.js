import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CategorySelector from '../components/CategorySelector';
import TimerDisplay from '../components/TimerDisplay';
import SessionSummary from '../components/SessionSummary';
import { saveSession } from '../utils/storage';
import { getCategoryLabel } from '../utils/categories';

const FOCUS_TIME = 25 * 60; // 25 dakika

export default function HomeScreen() {
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ders');
  const [distractions, setDistractions] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef(null);

  // AppState listener - Dikkat dağınıklığı takibi
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (isActive) {
        // Uygulama arka plana gidiyorsa
        if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
          backgroundTime.current = Date.now();
          setDistractions(prev => prev + 1);
          setIsActive(false); // Sayacı duraklat
          
          Alert.alert(
            '⚠️ Dikkat Dağınıklığı',
            'Uygulamadan ayrıldınız. Sayaç duraklatıldı.',
            [{ text: 'Tamam' }]
          );
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  // Zamanlayıcı
  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    const duration = FOCUS_TIME;
    
    const session = {
      category: selectedCategory,
      categoryLabel: getCategoryLabel(selectedCategory),
      duration: duration,
      distractions: distractions,
      date: sessionStartTime || new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    
    setCurrentSession(session);
    setShowSummary(true);
  };

  const toggleTimer = () => {
    if (!isActive && seconds === FOCUS_TIME) {
      // Yeni seans başlatılıyor
      setSessionStartTime(new Date().toISOString());
      setDistractions(0);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(FOCUS_TIME);
    setDistractions(0);
    setSessionStartTime(null);
  };

  const handleSaveSession = async () => {
    if (currentSession) {
      const saved = await saveSession(currentSession);
      if (saved) {
        Alert.alert('✅ Başarılı', 'Seans kaydedildi!');
        setShowSummary(false);
        resetTimer();
      } else {
        Alert.alert('❌ Hata', 'Seans kaydedilemedi.');
      }
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    resetTimer();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Odaklanma Seansı</Text>
        {isActive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Aktif</Text>
          </View>
        )}
      </View>

      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        disabled={isActive}
      />

      <TimerDisplay seconds={seconds} mode="focus" />

      {distractions > 0 && (
        <View style={styles.distractionBadge}>
          <Text style={styles.distractionText}>
            ⚠️ Dikkat Dağınıklığı: {distractions}
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.mainButton, isActive && styles.pauseButton]}
          onPress={toggleTimer}
        >
          <Text style={styles.mainButtonText}>
            {isActive ? '⏸ DURAKLAT' : '▶ BAŞLAT'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetTimer}
        >
          <Text style={styles.resetButtonText}>🔄 SIFIRLA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {isActive 
            ? '💡 Odaklanın! Uygulamadan çıkmayın.' 
            : '💡 Başlamak için kategori seçin ve başlat butonuna basın.'}
        </Text>
      </View>

      <SessionSummary
        visible={showSummary}
        session={currentSession}
        onClose={handleCloseSummary}
        onSave={handleSaveSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc71',
    marginRight: 8,
  },
  liveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  distractionBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 15,
    alignSelf: 'center',
  },
  distractionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    alignItems: 'center',
    marginTop: 30,
    gap: 15,
  },
  mainButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#f39c12',
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 15,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
