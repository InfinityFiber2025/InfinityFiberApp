
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
export default function Botao({ title, onPress, style }: {title: string; onPress?: () => void; style?: ViewStyle;}) {
  return <TouchableOpacity style={[styles.btn, style]} onPress={onPress} activeOpacity={0.85}><Text style={styles.txt}>{title}</Text></TouchableOpacity>;
}
const styles = StyleSheet.create({ btn:{backgroundColor:'#2D5BFF',paddingVertical:14,borderRadius:14,alignItems:'center'}, txt:{color:'#fff',fontWeight:'700'} });
