
import React from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';

type Props = TextInputProps & { label?: string };

export default function Input({ label, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput placeholderTextColor="#9AA1B1" style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: '#3B3F4C', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#E2E6EF',
    backgroundColor: '#F7F8FB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16
  }
});
