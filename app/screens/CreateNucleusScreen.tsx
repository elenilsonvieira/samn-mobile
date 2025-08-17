import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function CreateNucleusScreen() {
  const [nucleusName, setNucleusName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    console.log("Nucleus created:", { nucleusName, description });
    alert("Nucleus created successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criação do Nucleo</Text>

      <TextInput
        style={styles.input}
        placeholder="Adcione o nome do nucleo"
        value={nucleusName}
        onChangeText={setNucleusName}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrção do nucleo"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1B4332",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
