
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
import Welcome from '@/screens/cliente/Welcome';
import LoginCliente from '@/screens/cliente/LoginCliente';
import BiometriaCliente from '@/screens/cliente/BiometriaCliente';
import DashboardCliente from '@/screens/cliente/DashboardCliente';

const AdminStackNav = createNativeStackNavigator();
const ClienteStackNav = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AdminStack() {
  return (
    <AdminStackNav.Navigator>
      <AdminStackNav.Screen name="LoginAdmin" component={LoginAdmin} options={{ headerShown: false }} />
      <AdminStackNav.Screen name="DashboardAdmin" component={DashboardAdmin} options={{ title: 'Admin' }} />
      <AdminStackNav.Screen name="Clientes" component={Clientes} />
      <AdminStackNav.Screen name="Transacoes" component={Transacoes} />
      <AdminStackNav.Screen name="BiometriaAdmin" component={BiometriaAdmin} options={{ title: 'Biometria' }} />
    </AdminStackNav.Navigator>
  );
}

function ClienteStack() {
  return (
    <ClienteStackNav.Navigator>
      <ClienteStackNav.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <ClienteStackNav.Screen name="LoginCliente" component={LoginCliente} options={{ title: 'Login' }} />
      <ClienteStackNav.Screen name="BiometriaCliente" component={BiometriaCliente} options={{ title: 'Biometria' }} />
      <ClienteStackNav.Screen name="DashboardCliente" component={DashboardCliente} options={{ title: 'Home' }} />
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
