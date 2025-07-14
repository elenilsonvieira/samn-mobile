import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "@/components/Header";

export default function NoticeListScreen(){
  const notices = [
    {
      title: "Monitoria de Algoritmos",
      date: "11/08",
      start: "8:00",
      monitor: "Rafael",
      description: "Uma aula onde iremos revisar e trabalhar os conceitos iniciais de programação."
    },
    {
      title: "Revisão de HTML",
      date: "14/07",
      start: "15:00",
      monitor: "Davi",
      description: "Revisão para avaliação prática do dia 21 de julho."
    },
    {
      title: "Monitoria de Matemática",
      date: "22/07",
      start: "15:00",
      monitor: "Rafael",
      description: "Aula que terá o foco em revisar e resolver exercícios sobre limites laterais."
    }
  ];

  return (
    <ScrollView>
      <Header/>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Listagem de Avisos</Text>
        {notices.map((notice, index) => (
          <View key={index} style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <View style={styles.row}>
              <Text style={styles.noticeText}>Data: {notice.date}</Text>
              <Text style={styles.noticeText}>Início: {notice.start}</Text>
            </View>
            <Text style={styles.noticeText}>Monitor: {notice.monitor}</Text>
            <Text style={styles.noticeDescription}>{notice.description}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
    title:{
        marginTop: 30,
        textAlign: 'center',
        fontSize: 32,
        marginBottom:30,
        color:'black'
    },
    mainContainer: {
      paddingTop: 5,
      marginTop: 10,
      marginHorizontal: 10,
      borderRadius: 20,
    },
    noticeContainer: {
      marginHorizontal: 7,
      marginBottom: 20,
      backgroundColor: "#f4f4f4",
      padding: 15,
      borderRadius: 10,
      shadowColor: "#000",
      elevation: 5,
    },
    noticeTitle: {
      color: "#333",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 4,
      textAlign: 'center'
    },
    noticeText: {
      fontSize: 16,
      color: "gray",
      marginBottom: 4,
    },
    noticeDescription: {
      fontSize: 16,
      color: "black",
      marginTop: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
});
