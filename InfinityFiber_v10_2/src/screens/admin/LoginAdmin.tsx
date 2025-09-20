
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '@/components/Input'; import Botao from '@/components/Botao';
export default function LoginAdmin({ navigation }: any){
  const [user,setUser]=useState(''); const [pass,setPass]=useState('');
  const entrar=()=>{ if(user==='Danielkascher' && pass==='K@scher123'){ navigation.replace('DashboardAdmin'); } else { Alert.alert('Acesso negado','Usuário ou senha inválidos.'); } };
  return (<View style={styles.container}>
    <Text style={styles.brand}>Infinity Fiber • Admin</Text>
    <Input label="Usuário" placeholder="Danielkascher" autoCapitalize="none" value={user} onChangeText={setUser}/>
    <Input label="Senha" placeholder="••••••••" secureTextEntry value={pass} onChangeText={setPass}/>
    <Botao title="Entrar" onPress={entrar}/>
  </View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:24,backgroundColor:'#0A0E2A'}, brand:{color:'#fff',fontSize:24,fontWeight:'800',marginBottom:16} });
