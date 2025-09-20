
import React from 'react'; import { View, Text, StyleSheet, FlatList } from 'react-native'; import Card from '@/components/Card';
const HIST=[{id:'h1',desc:'PIX recebido',valor:250.00,data:'2025-09-16'},{id:'h2',desc:'Pagamento boleto',valor:-89.50,data:'2025-09-15'},{id:'h3',desc:'Transferência',valor:-120.00,data:'2025-09-14'}];
export default function TransacoesTab(){ return (<View style={styles.container}><Text style={styles.title}>Transações</Text>
  <FlatList data={HIST} keyExtractor={i=>i.id} renderItem={({item})=>(<Card><Text style={styles.row}>{item.data} — {item.desc}</Text><Text style={styles.val}>{item.valor<0?'-':''}R$ {Math.abs(item.valor).toFixed(2)}</Text></Card>)}/></View>); }
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:20,fontWeight:'800',marginBottom:8}, row:{fontWeight:'600'}, val:{color:'#374151',marginTop:4} });
