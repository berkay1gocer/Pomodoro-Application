export const CATEGORIES = [
  { label: 'Ders Çalışma', value: 'ders', color: '#FF6B6B' },
  { label: 'Kodlama', value: 'kodlama', color: '#4ECDC4' },
  { label: 'Proje', value: 'proje', color: '#45B7D1' },
  { label: 'Kitap Okuma', value: 'kitap', color: '#FFA07A' },
  { label: 'Yazı Yazma', value: 'yazi', color: '#98D8C8' },
  { label: 'Diğer', value: 'diger', color: '#95A5A6' },
];

export const getCategoryColor = (categoryValue) => {
  const category = CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.color : '#95A5A6';
};

export const getCategoryLabel = (categoryValue) => {
  const category = CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.label : 'Diğer';
};
