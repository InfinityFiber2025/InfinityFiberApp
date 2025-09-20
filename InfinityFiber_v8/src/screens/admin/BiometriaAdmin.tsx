
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import Botao from '@/components/Botao';

export default function BiometriaAdmin({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const camRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleConfirm = async () => {
    if (camRef.current) {
      try {
        await camRef.current.takePictureAsync({ skipProcessing: true });
      } catch (e) {
        console.log('Camera error', e);
      }
    }
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Solicitando permissão da câmera...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>Permissão de câmera negada.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.front} ref={(r) => (camRef.current = r)} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Biometria Admin</Text>
        <Text style={styles.subtitle}>Confirme olhando para a câmera</Text>
        <Botao title="Confirmar" onPress={handleConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
    padding: 16
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6, color: '#fff' },
  subtitle: { color: '#E5E7EB', marginBottom: 12 }
});
