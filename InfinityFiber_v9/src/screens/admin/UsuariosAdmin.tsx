
import React, { useState } from 'react'; import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card'; import Input from '@/components/Input'; import Botao from '@/components/Botao';
const BASE=[{id:'u1',nome:'Admin Master',papel:'Administrador'},{id:'u2',nome:'Carlos Tesoureiro',papel:'Tesoureiro'}];
export default function UsuariosAdmin(){
  const [q,setQ]=useState(''); const filtered=BASE.filter(u=>u.nome.toLowerCase().includes(q.toLowerCase()));
  return (<View style={styles.container}><Text style={styles.title}>Gestão de Usuários</Text><Input placeholder="Buscar por nome..." value={q} onChangeText={setQ}/>
    <FlatList data={filtered} keyExtractor={i=>i.id} renderItem={({item})=>(<Card><Text style={styles.row}>{item.nome}</Text><Text style={styles.sub}>{item.papel}</Text>
      <View style={{flexDirection:'row',gap:8}}><Botao title="Editar" onPress={()=>alert('Editar (simulado)')}/><Botao title="Desativar" onPress={()=>alert('Desativado (simulado)')}/></View></Card>)}/>
    <Botao title="Criar novo usuário" onPress={()=>alert('Criar (simulado)')}/></View>);
}
const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:20,fontWeight:'800',marginBottom:8}, row:{fontWeight:'700'}, sub:{color:'#6B7280',marginBottom:8} });
