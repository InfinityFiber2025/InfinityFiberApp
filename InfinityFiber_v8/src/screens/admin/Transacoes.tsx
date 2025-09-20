
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card';
import Botao from '@/components/Botao';

const DATA = [
  { id: 't1', cliente: 'Maria Santos', valor: 250.00, status: 'Pendente' },
  { id: 't2', cliente: 'João Almeida', valor: 85.90, status: 'Pendente' },
  { id: 't3', cliente: 'Carla Nunes', valor: 1000.00, status: 'Aprovada' },
];

export default function Transacoes({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>
      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>{item.cliente}</Text>
            <Text style={styles.line}>Valor: R$ {item.valor.toFixed(2)}</Text>
            <Text style={styles.line}>Status: {item.status}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Botao title="Aprovar" onPress={() => navigation.navigate('BiometriaAdmin')} />
              <Botao title="Recusar" />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  line: { color: '#6B7280', marginBottom: 4 }
});
