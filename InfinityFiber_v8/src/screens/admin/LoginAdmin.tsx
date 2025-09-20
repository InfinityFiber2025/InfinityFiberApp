
import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '@/components/Input';
import Botao from '@/components/Botao';

export default function LoginAdmin({ navigation }: any) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.logoWrap}>
        <Text style={styles.brand}>Infinity Fiber • Admin</Text>
        <Text style={styles.subtitle}>Acesse com sua conta de administrador ou tesoureiro</Text>
      </View>
      <View style={styles.form}>
        <Input label="E-mail" placeholder="admin@infinityfiber.com" autoCapitalize="none" keyboardType="email-address" />
        <Input label="Senha" placeholder="••••••••" secureTextEntry />
        <Botao title="Entrar" onPress={() => navigation.replace('DashboardAdmin')} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0A0E2A' },
  logoWrap: { marginTop: 80, marginBottom: 24 },
  brand: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#B8C0FF', marginTop: 8 },
  form: { backgroundColor: '#fff', borderRadius: 18, padding: 16 }
});
