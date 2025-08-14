import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl
} from 'react-native';
import Footer from '@/components/Footer';
import { IMonitor } from '@/components/interfaces/IMonitor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = '@monitores';

type MonitorPersistido = IMonitor & {
  id?: string;
  criadoEm?: string;
};

export default function MonitorsScreen() {
  const [monitores, setMonitores] = useState<MonitorPersistido[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const list: MonitorPersistido[] = stored ? JSON.parse(stored) : [];
      setMonitores(list);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const renderItem = ({ item }: { item: MonitorPersistido }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Matrícula: {item.matricula}</Text>
      <Text>Disciplina: {item.disciplina}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>Monitores</Text>

        <FlatList
          data={monitores}
          keyExtractor={(item) => item.id ?? item.matricula}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.lista,
            monitores.length === 0 && { flex: 1, justifyContent: 'center' },
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#555' }}>
              Nenhum monitor cadastrado.
            </Text>
          }
        />
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { flex: 1, paddingHorizontal: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
  lista: { paddingBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nome: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
});
