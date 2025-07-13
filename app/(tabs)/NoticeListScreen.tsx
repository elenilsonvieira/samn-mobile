import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import MyScrollView from "@/components/MyScrollView";

function NoticeListScreen(){
  return (
    <MyScrollView>
      <View>
        <Text style={styles.title}>Listagem de Avisos</Text>
      </View>
      <View>
        <Text style={styles.conteudo}>Monitoria de Algoritmos</Text>
        <Text style={styles.conteudo}>Data: 11/08</Text>
        <Text style={styles.conteudo}>Horario de Inicio: 8:00</Text>
        <Text style={styles.conteudo}>Monitor: Rafael</Text>
        <Text style={styles.conteudo}>Descrição: Uma aula onde iremos revisar e trabalhar os conceitos inicias de programação.</Text>
      </View>
    </MyScrollView>
  );
}
const styles = StyleSheet.create({
    title:{
        marginTop:30,
        textAlign: 'center',
        fontSize: 40,
        marginBottom:30,
        color:'white'
    },
    conteudo:{
        textAlign:'center',
        fontSize: 25,
        color:'gray' 
    },
});
export default NoticeListScreen;
