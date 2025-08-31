import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../components/src/fireBaseConfig";
import AlunoCard from "../../components/AlunoCard";
import Toast from "react-native-toast-message";

export default function AlunosScreen() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedAluno, setSelectedAluno] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [novoTipo, setNovoTipo] = useState<string>("");
  const [materia, setMateria] = useState<string>("");

  const materiasDisponiveis = [
    "Algoritmos",
    "Cálculo I",
    "Estrutura de Dados",
    "Banco de Dados",
    "Sistemas Operacionais",
  ];

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const snapshot = await getDocs(collection(db, "usuarios"));

      const lista: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtrados = lista.filter(
        (user) => user.tipo === "aluno" || user.tipo === "monitor"
      );

      setAlunos(filtrados);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  const confirmarAlteracao = async () => {
    if (!selectedAluno) return;

    if (novoTipo === "monitor" && !materia) {
    Toast.show({
      type: "error",
      text1: "Ainda não podemos prosseguir",
      text2: "É necessário atribuir uma matéria ao Monitor",
    });
      return;
    }

    Alert.alert(
      "Confirmação",
      novoTipo === "monitor"
        ? `Quer tornar ${selectedAluno.nome} um monitor de ${materia}?`
        : `Quer tornar ${selectedAluno.nome} um aluno novamente?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            await updateDoc(doc(db, "usuarios", selectedAluno.id), {
              tipo: novoTipo,
              ...(novoTipo === "monitor" ? { materia } : { materia: "" }),
            });
            setModalVisible(false);
            load();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1B4332" />
        <Text>Carregando alunos...</Text>
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Alunos</Text>

        <FlatList
          data={alunos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedAluno(item);
                setNovoTipo(item.tipo);
                setMateria(item.materia || "");
                setModalVisible(true);
              }}
            >
              <AlunoCard
                nome={item.nome ?? "Sem nome"}
                matricula={item.matricula ?? "Sem matrícula"}
                email={item.email ?? "Sem email"}
                tipo={item.tipo ?? "aluno"}
              />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum aluno encontrado.</Text>
          }
        />

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              {selectedAluno && (
                <>
                  <Text style={styles.modalTitulo}>{selectedAluno.nome}</Text>
                  <Text>Email: {selectedAluno.email}</Text>
                  <Text>Matrícula: {selectedAluno.matricula}</Text>

                  <Text style={{ marginTop: 10 }}>Tipo:</Text>
                  <Picker
                    selectedValue={novoTipo}
                    onValueChange={(valor) => {
                      setNovoTipo(valor);
                      if (valor !== "monitor") setMateria("");
                    }}
                    style={{ height: 50, width: "100%", color: "black" }}
                    dropdownIconColor="black"
                  >
                    <Picker.Item label="Aluno" value="aluno" />
                    <Picker.Item label="Monitor" value="monitor" />
                  </Picker>

                  {novoTipo === "monitor" && (
                    <>
                      <Text style={{ marginTop: 10 }}>Matéria:</Text>
                      <Picker
                        style={{ height: 50, width: "100%", color: "black" }}
                        dropdownIconColor="black"
                        selectedValue={materia}
                        onValueChange={(valor) => {
                          if (materia && valor !== materia) {
                            Alert.alert(
                              "Confirmação",
                              `Certeza que deseja mudar a matéria "${materia}" que foi atribuída a "${selectedAluno.nome}" para "${valor}"?`,
                              [
                                { text: "Cancelar", style: "cancel" },
                                {
                                  text: "Sim",
                                  onPress: () => setMateria(valor),
                                },
                              ]
                            );
                          } else {
                            setMateria(valor);
                          }
                        }}
                      >
                        <Picker.Item label="Selecione a matéria" value="" />
                        {materiasDisponiveis.map((m) => (
                          <Picker.Item key={m} label={m} value={m} />
                        ))}
                      </Picker>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.btnConfirmar}
                    onPress={confirmarAlteracao}
                  >
                    <Text style={{ color: "#fff" }}>Confirmar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnFechar}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: "#fff" }}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    gap: 10,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btnConfirmar: {
    marginTop: 15,
    backgroundColor: "#1B4332",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnFechar: {
    marginTop: 10,
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
