
import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import LoginAdmin from '@/screens/admin/LoginAdmin';
import DashboardAdmin from '@/screens/admin/DashboardAdmin';
import Clientes from '@/screens/admin/Clientes';
import Transacoes from '@/screens/admin/Transacoes';
import BiometriaAdmin from '@/screens/admin/BiometriaAdmin';
import UsuariosAdmin from '@/screens/admin/UsuariosAdmin';
import RelatoriosAdmin from '@/screens/admin/RelatoriosAdmin';

import Welcome from '@/screens/cliente/Welcome';
import LoginCliente from '@/screens/cliente/LoginCliente';
import BiometriaCliente from '@/screens/cliente/BiometriaCliente';
import DashboardCliente from '@/screens/cliente/DashboardCliente';
import Pix from '@/screens/cliente/Pix';
import Boleto from '@/screens/cliente/Boleto';
import CartaoDigital from '@/screens/cliente/CartaoDigital';
import Extrato from '@/screens/cliente/Extrato';
import TransacoesTab from '@/screens/cliente/TransacoesTab';
import Notificacoes from '@/screens/cliente/Notificacoes';
import Perfil from '@/screens/cliente/Perfil';

const AdminStackNav = createNativeStackNavigator();
const ClienteStackNav = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AdminStack() {
  return (
    <AdminStackNav.Navigator>
      <AdminStackNav.Screen name="LoginAdmin" component={LoginAdmin} options={{ headerShown: false }} />
      <AdminStackNav.Screen name="DashboardAdmin" component={DashboardAdmin} options={{ title: 'Admin' }} />
      <AdminStackNav.Screen name="Clientes" component={Clientes} options={{ title: 'Clientes' }} />
      <AdminStackNav.Screen name="Transacoes" component={Transacoes} options={{ title: 'Transações' }} />
      <AdminStackNav.Screen name="UsuariosAdmin" component={UsuariosAdmin} options={{ title: 'Usuários' }} />
      <AdminStackNav.Screen name="RelatoriosAdmin" component={RelatoriosAdmin} options={{ title: 'Relatórios' }} />
      <AdminStackNav.Screen name="BiometriaAdmin" component={BiometriaAdmin} options={{ title: 'Biometria' }} />
    </AdminStackNav.Navigator>
  );
}

function ClienteTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="Home" component={DashboardCliente} />
      <Tabs.Screen name="TransacoesTab" component={TransacoesTab} options={{ title: 'Transações' }} />
      <Tabs.Screen name="Notificacoes" component={Notificacoes} options={{ title: 'Notificações' }} />
      <Tabs.Screen name="Perfil" component={Perfil} />
    </Tabs.Navigator>
  );
}

function ClienteStack() {
  return (
    <ClienteStackNav.Navigator>
      <ClienteStackNav.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <ClienteStackNav.Screen name="LoginCliente" component={LoginCliente} options={{ title: 'Login' }} />
      <ClienteStackNav.Screen name="BiometriaCliente" component={BiometriaCliente} options={{ title: 'Biometria' }} />
      <ClienteStackNav.Screen name="ClienteTabs" component={ClienteTabs} options={{ headerShown: false }} />
      <ClienteStackNav.Screen name="Pix" component={Pix} options={{ title: 'PIX / Transferência' }} />
      <ClienteStackNav.Screen name="Boleto" component={Boleto} options={{ title: 'Pagar Boleto / QR' }} />
      <ClienteStackNav.Screen name="CartaoDigital" component={CartaoDigital} options={{ title: 'Cartão Digital' }} />
      <ClienteStackNav.Screen name="Extrato" component={Extrato} options={{ title: 'Extrato' }} />
    </ClienteStackNav.Navigator>
  );
}

function ModeChooser({ navigation }: any) {
  return (
    <View style={styles.modeWrap}>
      <Text style={styles.modeTitle}>Escolha o modo</Text>
      <TouchableOpacity style={styles.modeBtn} onPress={() => navigation.navigate('Admin')}>
        <Text style={styles.modeTxt}>App Administrativo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeBtn} onPress={() => navigation.navigate('Cliente')}>
        <Text style={styles.modeTxt}>App Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const theme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#ffffff' }
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator>
        <RootStack.Screen name="Selecionar" component={ModeChooser} options={{ headerShown: false }} />
        <RootStack.Screen name="Admin" component={AdminStack} options={{ headerShown: false }} />
        <RootStack.Screen name="Cliente" component={ClienteStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modeWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0E2A', gap: 12 },
  modeTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  modeBtn: { backgroundColor: '#2D5BFF', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14 },
  modeTxt: { color: '#fff', fontWeight: '700' }
});
