import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

type AvisoFormProps = {
  onSalvar: (dados: {
    materia: string;
    data: string;
    hora: string;
    descricao: string;
  }) => void;
};

export default function AvisoForm({ onSalvar }: AvisoFormProps) {
  const [materia, setMateria] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [descricao, setDescricao] = useState("");

  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const materiasDisponiveis = [
    "Algoritmos",
    "Cálculo I",
    "Estrutura de Dados",
    "Banco de Dados",
    "Sistemas Operacionais",
  ];

  const handleSalvar = () => {
    const dataFormatada = data.toLocaleDateString("pt-BR");
    const horaFormatada = hora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    onSalvar({
      materia,
      data: dataFormatada,
      hora: horaFormatada,
      descricao,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Disciplina:</Text>
      <Picker
        selectedValue={materia}
        onValueChange={(itemValue) => setMateria(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma matéria" value="" />
        {materiasDisponiveis.map((m, index) => (
          <Picker.Item key={index} label={m} value={m} />
        ))}
      </Picker>

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity style={styles.botaoData} onPress={() => setMostrarData(true)}>
        <Text style={styles.botaoDataTexto}>
          {data.toLocaleDateString("pt-BR")}
        </Text>
      </TouchableOpacity>
      {mostrarData && (
        <DateTimePicker
          value={data}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setMostrarData(false);
            if (selectedDate) setData(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Hora:</Text>
      <TouchableOpacity style={styles.botaoData} onPress={() => setMostrarHora(true)}>
        <Text style={styles.botaoDataTexto}>
          {hora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>

      {mostrarHora && (
        <DateTimePicker
          value={hora}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedTime) => {
            setMostrarHora(false);
            if (selectedTime) setHora(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Assunto da monitoria, local etc."
        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, (!materia || !descricao) && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={!materia || !descricao}
      >
        <Text style={styles.botaoSalvarTexto}>Criar Aviso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 20,
  },
  botaoData: {
    backgroundColor: '#ebebeb',
    padding: 10,
    alignItems: 'center',
    elevation: 5,
  },
  botaoDataTexto: {
    color: 'black',
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#ebebeb",
    color: 'black',
    textAlign: 'center',
    elevation: 5,
  },
  input: {
    backgroundColor: '#ebebeb',
    padding: 10,
    borderRadius: 5,
    minHeight: 60,
    textAlignVertical: "top",
  },
  botaoSalvar: {
    backgroundColor: '#1b5e20',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
    elevation: 5,
  },
  botaoSalvarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoDesabilitado: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
});
