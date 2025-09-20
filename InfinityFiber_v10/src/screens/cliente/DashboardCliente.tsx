
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Card from '@/components/Card';

const HIST=[
  {id:'h1',desc:'PIX recebido',valor:250.00,data:'2025-09-16'},
  {id:'h2',desc:'Pagamento boleto',valor:-89.50,data:'2025-09-15'},
  {id:'h3',desc:'Transferência',valor:-120.00,data:'2025-09-14'}
];

export default function DashboardCliente({ navigation }: any){
  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Olá, Cliente 👋</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponível</Text>
        <Text style={styles.balanceValue}>R$ 3.420,55</Text>
      </View>

      <View style={styles.grid}>
        <Shortcut title="PIX / Transferir" onPress={()=>navigation.navigate('Pix')}/>
        <Shortcut title="Pagar Boleto / QR" onPress={()=>navigation.navigate('Boleto')}/>
        <Shortcut title="Cartão Digital" onPress={()=>navigation.navigate('CartaoDigital')}/>
        <Shortcut title="Extrato Completo" onPress={()=>navigation.navigate('Extrato')}/>
      </View>

      <Text style={styles.sectionTitle}>Últimas transações</Text>
      <FlatList
        data={HIST}
        keyExtractor={i=>i.id}
        renderItem={({item})=>(
          <Card>
            <Text style={styles.txRow}>{item.data} — {item.desc}</Text>
            <Text style={[styles.txVal, item.valor<0 && {color:'#EF4444'}]}>{item.valor<0?'-':''}R$ {Math.abs(item.valor).toFixed(2)}</Text>
          </Card>
        )}
      />
    </View>
  );
}

function Shortcut({ title, onPress }: {title:string; onPress:()=>void}){
  return (
    <TouchableOpacity style={styles.shortcut} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.shortcutText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#F7F8FB'},
  hello:{fontSize:18,fontWeight:'700',marginBottom:10},
  balanceCard:{backgroundColor:'#0A0E2A',borderRadius:18,padding:18,marginBottom:14},
  balanceLabel:{color:'#B8C0FF'},
  balanceValue:{color:'#fff',fontSize:28,fontWeight:'800',marginTop:4},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginBottom:12},
  shortcut:{backgroundColor:'#fff',borderWidth:1,borderColor:'#E6E9F2',borderRadius:16,padding:14,width:'48%'},
  shortcutText:{fontWeight:'700',color:'#111827'},
  sectionTitle:{fontSize:16,fontWeight:'700',marginVertical:8},
  txRow:{fontWeight:'600'},
  txVal:{color:'#374151',marginTop:4}
});
