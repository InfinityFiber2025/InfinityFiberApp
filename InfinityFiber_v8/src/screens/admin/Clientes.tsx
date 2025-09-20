
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card';
import Botao from '@/components/Botao';

const DATA = [
  { id: '1', nome: 'Maria Santos', saldo: 4250.35 },
  { id: '2', nome: 'João Almeida', saldo: 120.10 },
  { id: '3', nome: 'Carla Nunes', saldo: 789.22 },
];

export default function Clientes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Clientes</Text>
      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.saldo}>Saldo: R$ {item.saldo.toFixed(2)}</Text>
            <Botao title="Ver detalhes" />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700' },
  saldo: { color: '#6B7280', marginVertical: 6 }
});
