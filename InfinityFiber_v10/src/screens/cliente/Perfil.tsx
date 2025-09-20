
import React from 'react'; import { View, Text, StyleSheet } from 'react-native'; import Botao from '@/components/Botao';
export default function Perfil({ navigation }: any){
  return (<View style={styles.container}><Text style={styles.title}>Perfil</Text>
    <Text style={styles.item}>Nome: Cliente Infinity</Text><Text style={styles.item}>CPF: 000.000.000-00</Text><Text style={styles.item}>E-mail: cliente@infinity.com</Text>
    <Botao title="Sair" onPress={()=>navigation.reset({index:0,routes:[{name:'Welcome'}]})}/></View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:20,fontWeight:'800',marginBottom:8}, item:{marginBottom:6} });
