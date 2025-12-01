export const calculateStats = (sessions) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Bugünkü toplam süre
  const todayTotal = sessions
    .filter(s => new Date(s.date) >= today)
    .reduce((sum, s) => sum + s.duration, 0);
  
  // Tüm zamanların toplamı
  const allTimeTotal = sessions.reduce((sum, s) => sum + s.duration, 0);
  
  // Toplam dikkat dağınıklığı
  const totalDistractions = sessions.reduce((sum, s) => sum + s.distractions, 0);
  
  // Son 7 günün verileri
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayTotal = sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      })
      .reduce((sum, s) => sum + s.duration, 0);
    
    last7Days.push({
      date: date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
      minutes: Math.round(dayTotal / 60)
    });
  }
  
  // Kategoriye göre dağılım
  const categoryStats = sessions.reduce((acc, session) => {
    const category = session.category || 'diger';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += session.duration;
    return acc;
  }, {});
  
  return {
    todayTotal: Math.round(todayTotal / 60), // dakikaya çevir
    allTimeTotal: Math.round(allTimeTotal / 60),
    totalDistractions,
    last7Days,
    categoryStats
  };
};
