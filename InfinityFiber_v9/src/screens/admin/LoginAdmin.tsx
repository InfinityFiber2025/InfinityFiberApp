
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '@/components/Input'; import Botao from '@/components/Botao';
export default function LoginAdmin({ navigation }: any){
  return (<View style={styles.container}>
    <Text style={styles.brand}>Infinity Fiber • Admin</Text>
    <Input label="E-mail" placeholder="admin@infinityfiber.com" keyboardType="email-address" autoCapitalize="none"/>
    <Input label="Senha" placeholder="••••••••" secureTextEntry />
    <Botao title="Entrar" onPress={()=>navigation.replace('DashboardAdmin')}/>
  </View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:24,backgroundColor:'#0A0E2A'}, brand:{color:'#fff',fontSize:24,fontWeight:'800',marginBottom:16} });
