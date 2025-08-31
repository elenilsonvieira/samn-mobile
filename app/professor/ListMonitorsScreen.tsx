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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../components/src/fireBaseConfig";
import MonitorCard from "../../components/MonitorCard";

export default function MonitorsScreen() {
  const [monitores, setMonitores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const q = query(
        collection(db, "usuarios"),
        where("tipo", "==", "monitor")
      );
      const snapshot = await getDocs(q);

      const lista: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMonitores(lista);
    } catch (err) {
      console.error("Erro ao carregar monitores:", err);
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
        <Text>Carregando monitores...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Monitores </Text>

      <FlatList
        data={monitores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MonitorCard
            materia={item.materia ?? "Não informado"}
            nome_do_responsavel={item.nome ?? "Sem nome"}
            matricula_do_responsavel={item.matricula ?? "Sem matrícula"}
            email_do_responsavel={item.email ?? "Sem email"}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum monitor encontrado.</Text>
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
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
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
