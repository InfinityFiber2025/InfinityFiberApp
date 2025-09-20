
import React, { useState, useEffect } from 'react'; import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card'; import Botao from '@/components/Botao';
const INITIAL=[{id:'t1',cliente:'Maria Santos',valor:250.00,status:'Pendente'},{id:'t2',cliente:'João Almeida',valor:85.90,status:'Pendente'},{id:'t3',cliente:'Carla Nunes',valor:1000.00,status:'Aprovada'}];
export default function Transacoes({navigation, route}:any){
  const [data,setData]=useState(INITIAL);
  useEffect(()=>{ const id=route?.params?.aprovada; if(id){ setData(prev=>prev.map(t=>t.id===id?{...t,status:'Aprovada'}:t)); } },[route?.params?.aprovada]);
  return (<View style={styles.container}>
    <Text style={styles.title}>Transações</Text>
    <FlatList data={data} keyExtractor={i=>i.id} renderItem={({item})=>(
      <Card><Text style={styles.name}>{item.cliente}</Text><Text style={styles.line}>Valor: R$ {item.valor.toFixed(2)}</Text><Text style={styles.line}>Status: {item.status}</Text>
      <View style={{flexDirection:'row',gap:8}}><Botao title="Aprovar" onPress={()=>navigation.navigate('BiometriaAdmin',{id:item.id})}/><Botao title="Recusar"/></View></Card>
    )}/>
  </View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:20,fontWeight:'800',marginBottom:8}, name:{fontWeight:'700',marginBottom:6}, line:{color:'#6B7280',marginBottom:4} });
