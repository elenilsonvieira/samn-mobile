import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AvisoForm from "../../components/NoticeForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CriarAvisoScreen() {

  const handleSalvar = (dados: {
    materia: string;
    data: string;
    hora: string;
    descricao: string;
  }) => {
    console.log("Aviso criado:", dados);

    Alert.alert("Aviso criado com sucesso!");
  };

  return (
    <View style={styles.mainContainer}>
      <Header/>
      <View style={styles.backContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Criar Monitoria</Text>
          <AvisoForm onSalvar={handleSalvar} />
        </View>
      </View>
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  backContainer: {
    backgroundColor: '#f9f9f9',
    paddingTop: 25,
    flex: 1,
  },
  input:{
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
    width: '75%',
  },
  Header: {
    marginTop: 35,
    backgroundColor: '#185545',
    width: '100%',
    height: '10%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  }
  ,
  container:{
    backgroundColor: '#dedede',
    paddingTop: 5,
    marginTop: 10,
    marginHorizontal:10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'center',
  }
});
