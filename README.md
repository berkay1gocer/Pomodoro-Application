# 🎯 Odaklanma Takibi ve Raporlama Uygulaması

React Native (Expo) ile geliştirilmiş, kullanıcıların odaklanma seanslarını takip eden ve raporlayan mobil uygulama.

## 📱 Özellikler

### Ana Sayfa (Zamanlayıcı)
- ⏱️ **25 dakikalık odaklanma sayacı** (Pomodoro tekniği)
- 🎯 **Kategori seçimi**: Ders Çalışma, Kodlama, Proje, Kitap Okuma, vb.
- ▶️ **Başlat/Duraklat/Sıfırla** kontrolleri
- ⚠️ **Dikkat dağınıklığı takibi** (AppState API ile)
- 📊 **Seans özeti** görüntüleme ve kaydetme

### Raporlar Ekranı
- 📈 **Genel İstatistikler**:
  - Bugün toplam odaklanma süresi
  - Tüm zamanların toplam odaklanma süresi
  - Toplam dikkat dağınıklığı sayısı
  - Toplam seans sayısı

- 📊 **Veri Görselleştirme**:
  - Son 7 güne ait odaklanma süreleri (Bar Chart)
  - Kategorilere göre dağılım (Pie Chart)

### Dikkat Dağınıklığı Takibi
- Kullanıcı uygulamadan ayrıldığında otomatik algılama
- Sayacı otomatik duraklama
- Dikkat dağınıklığı sayısını kaydetme

## 🛠️ Teknolojiler

- **React Native** (Expo)
- **React Navigation** - Tab Navigator
- **AsyncStorage** - Veri saklama
- **React Native Chart Kit** - Grafikler
- **AppState API** - Dikkat dağınıklığı takibi

## 📦 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/kullanici-adi/pomodoro-app.git

# Proje dizinine gidin
cd PomodoroApp

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

## 🚀 Kullanım

1. Ana sayfada bir kategori seçin
2. "BAŞLAT" butonuna basın
3. 25 dakika boyunca odaklanın
4. Uygulamadan ayrılırsanız dikkat dağınıklığı kaydedilir
5. Seans bittiğinde özet görüntülenir
6. Seansı kaydedin
7. Raporlar sekmesinden istatistiklerinizi görün

## 📂 Proje Yapısı

```
PomodoroApp/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Ana sayfa
│   │   └── ReportsScreen.js   # Raporlar sayfası
│   ├── components/
│   │   ├── CategorySelector.js    # Kategori seçici
│   │   ├── TimerDisplay.js        # Zamanlayıcı görünümü
│   │   └── SessionSummary.js      # Seans özeti modal
│   └── utils/
│       ├── storage.js           # AsyncStorage işlemleri
│       ├── categories.js        # Kategori tanımları
│       └── statsCalculator.js   # İstatistik hesaplamaları
├── App.js                # Ana uygulama (Navigation)
└── package.json
```

## 🎨 Ekran Görüntüleri

### Ana Sayfa
- Kategori seçimi
- Zamanlayıcı
- Dikkat dağınıklığı bildirimi
- Seans özeti

### Raporlar
- Genel istatistikler
- Son 7 gün grafiği
- Kategori dağılımı grafiği

## 📝 Gereksinimler

- Node.js
- Expo CLI
- iOS Simulator / Android Emulator veya Expo Go uygulaması

## 👨‍💻 Geliştirici

[Adınız Soyadınız]

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
