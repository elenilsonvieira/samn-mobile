import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import AvisoForm, { DadosAvisoRecorrente } from "../../components/NoticeForm";

const STORAGE_KEY = "@avisos_rules";

type AvisoRegraPersistida = DadosAvisoRecorrente & {
  id: string;
  createdAt: string;
};

export default function CreateNoticeScreen() {
  const handleSave = async (data: DadosAvisoRecorrente) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const rules: AvisoRegraPersistida[] = stored ? JSON.parse(stored) : [];

      const isRecorrente = data.frequencia !== "Apenas uma vez";

      let occurrencesSanitized =
        typeof data.occurrences === "number" && !Number.isNaN(data.occurrences)
          ? data.occurrences
          : undefined;

      if (isRecorrente && !data.untilISO && !occurrencesSanitized) {
        occurrencesSanitized = 12;
      }

      const newRules: AvisoRegraPersistida = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...data,
        occurrences: occurrencesSanitized,
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...rules, newRules])
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
      <ScrollView>
        <View style={styles.backContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Criar Aviso de Aula de Monitoria</Text>
            <AvisoForm onSalvar={handleSave} />
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