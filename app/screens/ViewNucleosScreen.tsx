import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function ViewNucleusScreen() {
  const data = [
    { id: "1", name: "Programação dispositivos móveis", aulas: 2 },
    { id: "2", name: "Programação WEB", aulas: 1 },
    { id: "3", name: "Segurança da informação", aulas: 3 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visualizar Núcleos</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>{item.aulas} aulas</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    color: "#555",
  },
});
