
import React from 'react'; import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/Card'; import Botao from '@/components/Botao';
export default function DashboardAdmin({ navigation }: any){
  return (<View style={styles.container}>
    <Text style={styles.title}>Dashboard Administrativo</Text>
    <View style={styles.row}>
      <Card><Text>Clientes</Text><Text style={styles.kpi}>1.248</Text></Card>
      <Card><Text>Saldo Geral</Text><Text style={styles.kpi}>R$ 8.235.920</Text></Card>
    </View>
    <View style={styles.row}>
      <Card><Text>Pendências</Text><Text style={styles.kpi}>17</Text></Card>
      <Card><Text>Transações hoje</Text><Text style={styles.kpi}>432</Text></Card>
    </View>
    <Card>
      <Text style={{fontWeight:'700',marginBottom:8}}>Ações rápidas</Text>
      <View style={{flexDirection:'row',gap:12,flexWrap:'wrap'}}>
        <Botao title="Gestão de Clientes" onPress={()=>navigation.navigate('Clientes')}/>
        <Botao title="Transações" onPress={()=>navigation.navigate('Transacoes')}/>
        <Botao title="Usuários" onPress={()=>navigation.navigate('UsuariosAdmin')}/>
        <Botao title="Relatórios" onPress={()=>navigation.navigate('RelatoriosAdmin')}/>
      </View>
    </Card>
  </View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:22,fontWeight:'800',marginBottom:8}, row:{flexDirection:'row',gap:12}, kpi:{fontSize:20,fontWeight:'800'} });
