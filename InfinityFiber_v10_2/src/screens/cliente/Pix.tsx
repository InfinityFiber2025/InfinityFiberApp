
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '@/components/Input';
import Botao from '@/components/Botao';
export default function Pix() {
  const [valor, setValor] = useState('');
  const [chave, setChave] = useState('');
  return (<View style={styles.container}><Text style={styles.title}>PIX / Transferência</Text>
    <Input label="Valor (R$)" keyboardType="numeric" value={valor} onChangeText={setValor} placeholder="0,00" />
    <Input label="Chave Pix" value={chave} onChangeText={setChave} placeholder="CPF, e-mail ou telefone" />
    <Botao title="Enviar (simulado)" onPress={() => alert('Transferência simulada enviada!')} /></View>);
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: '#fff' }, title: { fontSize: 20, fontWeight: '800', marginBottom: 8 } });
