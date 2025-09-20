
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import Botao from '@/components/Botao';

export default function BiometriaAdmin({ navigation, route }: any) {
  const [perm, setPerm] = useState<boolean | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const camRef = useRef<Camera | null>(null);
  const transacaoId = route?.params?.id ?? null;

  useEffect(()=>{(async()=>{const {status}=await Camera.requestCameraPermissionsAsync(); setPerm(status==='granted');})();},[]);

  const capturar = async ()=>{
    if (camRef.current) {
      const data = await camRef.current.takePictureAsync({ quality: 0.7 });
      setFoto(data.uri);
      const destino = FileSystem.documentDirectory + 'biometria_admin.jpg';
      await FileSystem.copyAsync({ from: data.uri, to: destino });
      console.log('Foto admin salva em:', destino);
    }
  };

  const confirmar = ()=>{
    Alert.alert('Sucesso', `Transação ${transacaoId || ''} aprovada com biometria.`);
    navigation.navigate('Transacoes', { aprovada: transacaoId });
  };

  if(perm===null) return <View style={styles.center}><Text>Solicitando permissão...</Text></View>;
  if(perm===false) return <View style={styles.center}><Text>Permissão negada.</Text></View>;

  return (
    <View style={{flex:1}}>
      {!foto ? (
        <>
          <Camera ref={(r)=>camRef.current=r} style={{flex:1}} type={CameraType.front}/>
          <View style={styles.overlay}>
            <Text style={styles.title}>Biometria Admin</Text>
            <Text style={styles.subtitle}>Olhe para a câmera para aprovar</Text>
            <Botao title="Capturar" onPress={capturar}/>
          </View>
        </>
      ) : (
        <View style={styles.preview}>
          <Image source={{ uri: foto }} style={styles.img}/>
          <Botao title="Usar foto (aprovar)" onPress={confirmar}/>
          <Botao title="Refazer" onPress={()=>setFoto(null)}/>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({ center:{flex:1,alignItems:'center',justifyContent:'center'}, overlay:{position:'absolute',bottom:60,width:'100%',alignItems:'center',padding:16}, title:{fontSize:22,fontWeight:'800',color:'#fff'}, subtitle:{color:'#E5E7EB',marginBottom:12}, preview:{flex:1,justifyContent:'center',alignItems:'center',gap:12}, img:{width:300,height:400,borderRadius:16} });
