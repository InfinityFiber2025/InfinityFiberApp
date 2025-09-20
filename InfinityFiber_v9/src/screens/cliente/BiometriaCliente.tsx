
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import Botao from '@/components/Botao';
export default function BiometriaCliente({ navigation }: any){
  const [perm,setPerm]=useState<boolean | null>(null); const camRef=useRef<Camera | null>(null);
  useEffect(()=>{(async()=>{const {status}=await Camera.requestCameraPermissionsAsync(); setPerm(status==='granted');})();},[]);
  const confirm=async()=>{ if(camRef.current){ try{await camRef.current.takePictureAsync({skipProcessing:true});}catch(e){} } navigation.replace('ClienteTabs'); };
  if(perm===null) return <View style={styles.center}><Text>Solicitando permissão da câmera...</Text></View>;
  if(perm===false) return <View style={styles.center}><Text>Permissão de câmera negada.</Text></View>;
  return (<View style={{flex:1}}><Camera style={{flex:1}} ref={(r)=>camRef.current=r} type={CameraType.front}/>
    <View style={styles.overlay}><Text style={styles.title}>Biometria</Text><Text style={styles.subtitle}>Olhe para a câmera para autenticar</Text><Botao title="Confirmar" onPress={confirm}/></View></View>);
}
const styles = StyleSheet.create({ center:{flex:1,alignItems:'center',justifyContent:'center'}, overlay:{position:'absolute',bottom:60,width:'100%',alignItems:'center',padding:16}, title:{fontSize:22,fontWeight:'800',color:'#fff'}, subtitle:{color:'#E5E7EB',marginBottom:12} });
