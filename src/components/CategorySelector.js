import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CATEGORIES } from '../utils/categories';

export default function CategorySelector({ selectedCategory, onCategoryChange, disabled }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kategori Seçin:</Text>
      <View style={[styles.pickerContainer, disabled && styles.disabled]}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={onCategoryChange}
          enabled={!disabled}
          style={styles.picker}
        >
          {CATEGORIES.map((category) => (
            <Picker.Item
              key={category.value}
              label={category.label}
              value={category.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  picker: {
    color: '#fff',
  },
});
