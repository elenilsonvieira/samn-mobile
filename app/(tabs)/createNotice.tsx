//createNotice
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import AvisoForm, { DadosAvisoRecorrente } from "../../components/NoticeForm";
import Header from "@/components/Header";

const STORAGE_KEY = "@avisos_rules";

type AvisoRegraPersistida = DadosAvisoRecorrente & {
  id: string;
  createdAt: string;
};

export default function CriarAvisoScreen() {
  const handleSalvar = async (dados: DadosAvisoRecorrente) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const regras: AvisoRegraPersistida[] = stored ? JSON.parse(stored) : [];

      const isRecorrente = dados.frequencia !== "Apenas uma vez";

      let occurrencesSanitized =
        typeof dados.occurrences === "number" && !Number.isNaN(dados.occurrences)
          ? dados.occurrences
          : undefined;

      if (isRecorrente && !dados.untilISO && !occurrencesSanitized) {
        occurrencesSanitized = 12;
      }

      const novaRegra: AvisoRegraPersistida = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...dados,
        occurrences: occurrencesSanitized,
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...regras, novaRegra])
      );

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
      <Header />
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