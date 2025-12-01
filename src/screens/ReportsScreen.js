import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getSessions, clearAllSessions } from '../utils/storage';
import { calculateStats } from '../utils/statsCalculator';
import { getCategoryColor, getCategoryLabel } from '../utils/categories';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const allSessions = await getSessions();
    setSessions(allSessions);
    const calculatedStats = calculateStats(allSessions);
    setStats(calculatedStats);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleClearData = () => {
    Alert.alert(
      '⚠️ Tüm Verileri Sil',
      'Tüm kayıtlı seanslar silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllSessions();
            if (success) {
              Alert.alert('✅ Başarılı', 'Tüm veriler silindi.');
              loadData();
            }
          },
        },
      ]
    );
  };

  if (!stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  // Pie Chart için veri hazırlama
  const pieData = Object.entries(stats.categoryStats).map(([category, duration]) => ({
    name: getCategoryLabel(category),
    minutes: Math.round(duration / 60),
    color: getCategoryColor(category),
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>📊 Raporlarım</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
          <Text style={styles.clearButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Genel İstatistikler */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#3498db' }]}>
          <Text style={styles.statValue}>{stats.todayTotal} dk</Text>
          <Text style={styles.statLabel}>Bugün Toplam</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.statValue}>{stats.allTimeTotal} dk</Text>
          <Text style={styles.statLabel}>Tüm Zamanlar</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.statValue}>{stats.totalDistractions}</Text>
          <Text style={styles.statLabel}>Toplam Dikkat Dağınıklığı</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#9b59b6' }]}>
          <Text style={styles.statValue}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Toplam Seans</Text>
        </View>
      </View>

      {/* Son 7 Gün Bar Chart */}
      {stats.last7Days.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📈 Son 7 Günün Odaklanma Süreleri</Text>
          <BarChart
            data={{
              labels: stats.last7Days.map(d => d.date),
              datasets: [{
                data: stats.last7Days.map(d => d.minutes || 0),
              }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            yAxisSuffix=" dk"
            fromZero={true}
          />
        </View>
      )}

      {/* Kategori Dağılımı Pie Chart */}
      {pieData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🎯 Kategorilere Göre Dağılım</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="minutes"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      )}

      {/* Veri yoksa mesaj */}
      {sessions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📭</Text>
          <Text style={styles.emptyTitle}>Henüz veri yok</Text>
          <Text style={styles.emptySubtitle}>
            Odaklanma seansları başlatıp tamamladığınızda burada istatistiklerinizi görebilirsiniz.
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🔄 Verileri güncellemek için aşağı çekin
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clearButton: {
    padding: 10,
  },
  clearButtonText: {
    fontSize: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    width: (screenWidth - 30) / 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});
