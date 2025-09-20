
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card';
import Botao from '@/components/Botao';

const HIST = [
  { id: 'h1', desc: 'PIX recebido', valor: 250.00 },
  { id: 'h2', desc: 'Pagamento boleto', valor: -89.50 },
  { id: 'h3', desc: 'Transferência', valor: -120.00 },
];

export default function DashboardCliente({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha conta</Text>
      <Card>
        <Text style={styles.kpiTitle}>Saldo disponível</Text>
        <Text style={styles.kpiValue}>R$ 3.420,55</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <Botao title="PIX / Transferir" />
          <Botao title="Pagar Boleto" />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <Botao title="Cartão Digital" />
          <Botao title="Extrato" />
        </View>
      </Card>
      <Text style={styles.subtitle}>Últimas transações</Text>
      <FlatList
        data={HIST}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.row}>{item.desc}</Text>
            <Text style={styles.val}>{item.valor < 0 ? '-' : ''}R$ {Math.abs(item.valor).toFixed(2)}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F7F8FB' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  kpiTitle: { color: '#6B7280' },
  kpiValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  subtitle: { fontSize: 16, fontWeight: '700', marginVertical: 8 },
  row: { fontWeight: '600' },
  val: { color: '#374151', marginTop: 4 }
});
