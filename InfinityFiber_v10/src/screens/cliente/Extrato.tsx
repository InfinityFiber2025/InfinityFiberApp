
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card'; import Input from '@/components/Input';
const DATA=[{ id:'1', data:'2025-09-15', desc:'PIX recebido', valor:200.00 },{ id:'2', data:'2025-09-14', desc:'Pagamento boleto', valor:-89.90 },{ id:'3', data:'2025-09-13', desc:'Transferência', valor:-150.00 }];
export default function Extrato(){
  const [filtro,setFiltro]=useState(''); const filtered=DATA.filter(i=>i.desc.toLowerCase().includes(filtro.toLowerCase()));
  return (<View style={styles.container}><Text style={styles.title}>Extrato</Text><Input placeholder="Filtrar por descrição..." value={filtro} onChangeText={setFiltro}/>
    <FlatList data={filtered} keyExtractor={(i)=>i.id} renderItem={({item})=>(<Card><Text style={styles.row}>{item.data} — {item.desc}</Text><Text style={styles.val}>{item.valor<0?'-':''}R$ {Math.abs(item.valor).toFixed(2)}</Text></Card>)}/></View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:16,backgroundColor:'#fff'}, title:{fontSize:20,fontWeight:'800',marginBottom:8}, row:{fontWeight:'600'}, val:{color:'#374151',marginTop:4} });
