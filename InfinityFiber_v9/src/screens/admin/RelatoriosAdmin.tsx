
import React from 'react'; import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/Card'; import Botao from '@/components/Botao';
export default function RelatoriosAdmin(){
  return (<View style={styles.container}><Text style={styles.title}>Relatórios</Text>
    <Card><Text style={styles.item}>Movimentação diária</Text><Botao title="Exportar CSV (simulado)" onPress={()=>alert('CSV exportado (simulado)!')}/></Card>
    <Card><Text style={styles.item}>Clientes por faixa de saldo</Text><Botao title="Exportar PDF (simulado)" onPress={()=>alert('PDF exportado (simulado)!')}/></Card>
  </View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:20,fontWeight:'800',marginBottom:8}, item:{marginBottom:8,fontWeight:'600'} });
