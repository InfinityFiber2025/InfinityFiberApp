
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Botao from '@/components/Botao';
export default function CartaoDigital() {
  const numero = '5448 2301 9876 1234'; const validade = '08/28'; const nome = 'CLIENTE INFINITY';
  return (<View style={styles.container}><Text style={styles.title}>Cartão Digital</Text>
    <View style={styles.card}><Text style={styles.brand}>Infinity Fiber</Text><Text style={styles.num}>{numero}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={styles.small}>Val: {validade}</Text><Text style={styles.small}>{nome}</Text></View></View>
    <Botao title="Copiar número" onPress={() => {navigator.clipboard?.writeText(numero); alert('Número copiado!')}} /></View>);
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: '#fff' }, title: { fontSize: 20, fontWeight: '800', marginBottom: 8 }, card: { backgroundColor: '#0A0E2A', borderRadius: 16, padding: 18, marginVertical: 12 }, brand: { color: '#B8C0FF', fontWeight: '700', marginBottom: 18 }, num: { color: '#fff', fontSize: 20, letterSpacing: 2, marginBottom: 10 }, small: { color: '#E5E7EB' } });
