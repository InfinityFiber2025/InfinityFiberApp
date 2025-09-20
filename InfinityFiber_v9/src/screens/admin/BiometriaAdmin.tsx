
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import Botao from '@/components/Botao';

export default function BiometriaAdmin({ navigation }: any) {
  const [perm, setPerm] = useState<boolean | null>(null);
  const camRef = useRef<Camera | null>(null);
  useEffect(()=>{(async()=>{const {status}=await Camera.requestCameraPermissionsAsync(); setPerm(status==='granted');})();},[]);
  const confirm = async ()=>{ if(camRef.current){ try{ await camRef.current.takePictureAsync({skipProcessing:true}); }catch(e){} } navigation.goBack(); };
  if(perm===null) return <View style={styles.center}><Text>Solicitando permissão...</Text></View>;
  if(perm===false) return <View style={styles.center}><Text>Permissão negada.</Text></View>;
  return (<View style={{flex:1}}>
    <Camera ref={(r)=>camRef.current=r} style={{flex:1}} type={CameraType.front}/>
    <View style={styles.overlay}><Text style={styles.title}>Biometria Admin</Text><Text style={styles.subtitle}>Olhe para a câmera e confirme</Text><Botao title="Confirmar" onPress={confirm}/></View>
  </View>);
}
const styles = StyleSheet.create({ center:{flex:1,alignItems:'center',justifyContent:'center'}, overlay:{position:'absolute',bottom:60,width:'100%',alignItems:'center',padding:16}, title:{fontSize:22,fontWeight:'800',color:'#fff'}, subtitle:{color:'#E5E7EB',marginBottom:12} });
