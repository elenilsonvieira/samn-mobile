import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../components/src/fireBaseConfig";
import AlunoCard from "../../components/AlunoCard";

export default function AlunosScreen() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const snapshot = await getDocs(collection(db, "usuarios"));

      const lista: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAlunos(lista);
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
      <Text style={styles.titulo}>Lista de Alunos</Text>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlunoCard
            nome={item.nome ?? "Sem nome"}
            matricula={item.matricula ?? "Sem matrícula"}
            email={item.email ?? "Sem email"}
            tipo={item.tipo ?? "aluno"}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum aluno encontrado.</Text>
        }
      />
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
});
