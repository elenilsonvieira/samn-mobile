import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import AvisoForm, { DadosAulaForm } from "../../components/NoticeForm";
import { criarAulaMonitoria } from "../../components/src/services/aulasMonitoriaService";
  

export default function CriarAvisoScreen() {
  const handleSalvar = async (dados: DadosAulaForm) => {
      try {
        await criarAulaMonitoria(dados);
        Toast.show({
            type: "success",
            text1: "Aviso criado!",
            text2: "A aula foi salva com sucesso.",
            position: "top",
        });
      } catch (e) {
        console.error(e);
        Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível salvar a aula.",
            position: "top",
        });
      }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.backContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Criar Aviso de Aula de Monitoria</Text>
            <AvisoForm onSalvar={handleSalvar} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  backContainer: {
    backgroundColor: "#f9f9f9",
    paddingTop: 25,
    flex: 1,
  },
  container: {
    backgroundColor: "#dedede",
    paddingTop: 5,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
  },
});
