
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from '@/components/Card';
import Botao from '@/components/Botao';

export default function DashboardAdmin({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard Administrativo</Text>
      <View style={styles.row}>
        <Card><Text style={styles.kpiTitle}>Clientes</Text><Text style={styles.kpiValue}>1.248</Text></Card>
        <Card><Text style={styles.kpiTitle}>Saldo Geral</Text><Text style={styles.kpiValue}>R$ 8.235.920</Text></Card>
      </View>
      <View style={styles.row}>
        <Card><Text style={styles.kpiTitle}>Pendências</Text><Text style={styles.kpiValue}>17</Text></Card>
        <Card><Text style={styles.kpiTitle}>Transações hoje</Text><Text style={styles.kpiValue}>432</Text></Card>
      </View>
      <Card>
        <Text style={styles.section}>Ações rápidas</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Botao title="Gestão de Clientes" onPress={() => navigation.navigate('Clientes')} />
          <Botao title="Transações" onPress={() => navigation.navigate('Transacoes')} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  kpiTitle: { color: '#6B7280', marginBottom: 8 },
  kpiValue: { fontSize: 20, fontWeight: '800' },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 8 }
});
