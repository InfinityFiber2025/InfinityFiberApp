
import React from 'react'; import { View, Text, StyleSheet } from 'react-native'; import Botao from '@/components/Botao';
export default function Welcome({ navigation }: any){
  return (<View style={styles.container}><Text style={styles.brand}>Infinity Fiber Bank</Text><Text style={styles.subtitle}>Bem-vindo(a)!</Text><Botao title="Entrar" onPress={()=>navigation.navigate('LoginCliente')}/></View>);
}
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#0A0E2A',alignItems:'center',justifyContent:'center',padding:24}, brand:{color:'#fff',fontSize:28,fontWeight:'800'}, subtitle:{color:'#B8C0FF',marginBottom:12,marginTop:8} });
