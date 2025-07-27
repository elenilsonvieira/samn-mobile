import React from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AvisoForm, { DadosAvisoRecorrente } from "../../components/NoticeForm";
import Header from "@/components/Header";
import MyScrollView from "@/components/MyScrollView";

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

      // Se for recorrente e não veio untilISO nem occurrences, define um fallback.
      let occurrencesSanitized =
        typeof dados.occurrences === "number" && !Number.isNaN(dados.occurrences)
          ? dados.occurrences
          : undefined;

      if (isRecorrente && !dados.untilISO && !occurrencesSanitized) {
        // fallback padrão – ajuste como quiser (ex.: 12 meses, 12 semanas, etc.)
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

      Alert.alert("Aviso (regra) criado com sucesso!");
    } catch (e) {
      console.error(e);
      Alert.alert("Erro ao salvar o aviso.");
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
