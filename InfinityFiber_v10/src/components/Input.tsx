
import React from 'react'; import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
export default function Input({ label, ...props }: TextInputProps & {label?: string}) {
  return (<View style={styles.wrap}>{label?<Text style={styles.label}>{label}</Text>:null}<TextInput style={styles.input} placeholderTextColor="#9AA1B1" {...props}/></View>);
}
const styles = StyleSheet.create({ wrap:{marginBottom:12}, label:{marginBottom:6,fontWeight:'600',color:'#3B3F4C'}, input:{borderWidth:1,borderColor:'#E2E6EF',backgroundColor:'#F7F8FB',borderRadius:12,paddingHorizontal:14,paddingVertical:12,fontSize:16} });
