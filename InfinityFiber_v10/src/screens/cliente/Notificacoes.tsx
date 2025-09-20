
import React from 'react'; import { View, Text, StyleSheet } from 'react-native'; import Card from '@/components/Card';
export default function Notificacoes(){ return (<View style={styles.container}><Text style={styles.title}>Notificações</Text>
  <Card><Text>Pagamento confirmado • hoje 10:42</Text></Card><Card><Text>PIX recebido de João • ontem 18:10</Text></Card><Card><Text>Atualização de segurança • 13/09</Text></Card></View>); }
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:20,fontWeight:'800',marginBottom:8} });
