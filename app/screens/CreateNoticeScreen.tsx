import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import AvisoForm, { DadosAulaForm } from "../../components/NoticeForm";
import {
  criarAulaMonitoria,
  atualizarAulaMonitoria,
  buscarAulaPorId,
} from "../../components/src/services/aulasMonitoriaService";
import { useLocalSearchParams, router } from "expo-router";

export default function CriarAvisoScreen() {
  const { id } = useLocalSearchParams();
  const [initialData, setInitialData] = useState<DadosAulaForm | null>(null);

  useEffect(() => {
    if (id) {
      const carregar = async () => {
        try {
          const dados = await buscarAulaPorId(String(id));
          if (dados)
            setInitialData({ ...dados, descricao: dados.descricao ?? "" });
        } catch (e) {
          console.error("Erro ao carregar aviso:", e);
        }
      };
      carregar();
    }
  }, [id]);

  const handleSalvar = async (dados: DadosAulaForm) => {
    try {
      if (id) {
        await atualizarAulaMonitoria(String(id), dados);
        Toast.show({
          type: "success",
          text1: "Aviso atualizado!",
          text2: "A aula foi modificada com sucesso.",
          position: "top",
        });
      } else {
        await criarAulaMonitoria(dados);
        Toast.show({
          type: "success",
          text1: "Aviso criado!",
          text2: "A aula foi salva com sucesso.",
          position: "top",
        });
      }

      router.back();
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
          <Text style={styles.title}>
            {id ? "Editar Aula de Monitoria" : "Agendar Aula de Monitoria"}
          </Text>
          <AvisoForm
            onSalvar={handleSalvar}
            initialValues={initialData || undefined}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  backContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: 25,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
  },
});
