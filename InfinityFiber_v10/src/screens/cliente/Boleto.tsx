
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '@/components/Input';
import Botao from '@/components/Botao';
export default function Boleto() {
  const [codigo, setCodigo] = useState('');
  return (<View style={styles.container}><Text style={styles.title}>Pagar Boleto / QR</Text>
    <Input label="Código de barras" value={codigo} onChangeText={setCodigo} placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000" />
    <Botao title="Pagar (simulado)" onPress={() => alert('Boleto pago (simulação)!')} /></View>);
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: '#fff' }, title: { fontSize: 20, fontWeight: '800', marginBottom: 8 } });
