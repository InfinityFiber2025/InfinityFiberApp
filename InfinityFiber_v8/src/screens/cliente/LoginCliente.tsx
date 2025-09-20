
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '@/components/Input';
import Botao from '@/components/Botao';

export default function LoginCliente({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login do Cliente</Text>
      <Input label="CPF ou E-mail" placeholder="000.000.000-00" />
      <Input label="Senha" placeholder="••••••••" secureTextEntry />
      <Botao title="Continuar" onPress={() => navigation.navigate('BiometriaCliente')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 }
});
