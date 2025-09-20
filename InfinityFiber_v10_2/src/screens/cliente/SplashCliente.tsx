
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

export default function SplashCliente({ navigation }: any) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 800, delay: 1200, useNativeDriver: true }),
    ]).start(() => navigation.replace('Welcome'));
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={require('@/../assets/icon.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0E2A', justifyContent:'center', alignItems:'center' },
  logo: { width:220, height:220 }
});
