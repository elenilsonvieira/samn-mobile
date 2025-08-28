import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Frequencia } from "../components/src/types/aulasMonitoria";

export type DadosAulaForm = {
  materia: string;
  dataHora: Date;
  local: string;
  descricao: string;
  frequencia: Frequencia;
};

type AvisoFormProps = {
  onSalvar: (dados: DadosAulaForm) => void | Promise<void>;
  initialValues?: DadosAulaForm; 
};

export default function AvisoForm({ onSalvar, initialValues }: AvisoFormProps) {
  const [materia, setMateria] = useState(initialValues?.materia || "");
  const [data, setData] = useState(initialValues?.dataHora || new Date());
  const [hora, setHora] = useState(initialValues?.dataHora || new Date());
  const [local, setLocal] = useState(initialValues?.local || "");
  const [descricao, setDescricao] = useState(initialValues?.descricao || "");
  const [frequencia, setFrequencia] = useState<Frequencia | "">(
    initialValues?.frequencia || ""
  );
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setMateria(initialValues.materia);
      setData(initialValues.dataHora);
      setHora(initialValues.dataHora);
      setLocal(initialValues.local);
      setDescricao(initialValues.descricao);
      setFrequencia(initialValues.frequencia);
    }
  }, [initialValues]);

  const materiasDisponiveis = [
    "Algoritmos",
    "Cálculo I",
    "Estrutura de Dados",
    "Banco de Dados",
    "Sistemas Operacionais",
  ];
  const locais = [
    "Sala 01",
    "Sala 02",
    "Sala 03",
    "Sala 04",
    "Sala 05",
    "Sala 06",
    "Sala 07",
    "Sala 08",
    "Sala 09",
    "Sala 10",
  ];
  const arrayFrequencia: Frequencia[] = ["Única", "Semanal", "Mensal", "Anual"];

  const canSave = !!materia && frequencia !== "" && !!local && !loading;

  const handleSalvar = async () => {
    if (!materia.trim() || !local.trim() || !frequencia) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos corretamente (sem apenas espaços).",
        position: "top",
      });
      return;
    }

    const dataHora = new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate(),
      hora.getHours(),
      hora.getMinutes()
    );

    if (dataHora < new Date()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Data/hora já passou!",
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      await onSalvar({
        materia: materia.trim(),
        dataHora,
        local: local.trim(),
        descricao: descricao.trim(),
        frequencia: frequencia as Frequencia,
      });

      if (!initialValues) {
        setMateria("");
        setData(new Date());
        setHora(new Date());
        setLocal("");
        setDescricao("");
        setFrequencia("");
      }
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err.message,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Disciplina:</Text>
      <Picker
        selectedValue={materia}
        onValueChange={setMateria}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma disciplina" value="" />
        {materiasDisponiveis.map((m, i) => (
          <Picker.Item key={i} label={m} value={m} />
        ))}
      </Picker>

      <View style={styles.row}>
        <Text style={styles.labelData}>Data:</Text>
        <Text style={styles.labelHora}>Hora:</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.botaoData}
          onPress={() => setMostrarData(true)}
        >
          <Text style={styles.botaoDataTexto}>
            {data.toLocaleDateString("pt-BR")}
          </Text>
        </TouchableOpacity>
        {mostrarData && (
          <DateTimePicker
            value={data}
            mode="date"
            minimumDate={new Date()}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, d) => {
              setMostrarData(false);
              if (d) setData(d);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.botaoData}
          onPress={() => setMostrarHora(true)}
        >
          <Text style={styles.botaoDataTexto}>
            {hora.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {mostrarHora && (
          <DateTimePicker
            value={hora}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, h) => {
              setMostrarHora(false);
              if (h) setHora(h);
            }}
          />
        )}
      </View>

      <Text style={styles.label}>Local:</Text>
      <Picker
        selectedValue={local}
        onValueChange={setLocal}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um local" value="" />
        {locais.map((l, i) => (
          <Picker.Item key={i} label={l} value={l} />
        ))}
      </Picker>

      <Text style={styles.label}>Frequência:</Text>
      <Picker
        selectedValue={frequencia}
        onValueChange={(v) => setFrequencia(v as Frequencia)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a frequência" value="" />
        {arrayFrequencia.map((f, i) => (
          <Picker.Item key={i} label={f} value={f} />
        ))}
      </Picker>

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Assunto da monitoria, extras, etc."
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, !canSave && styles.botaoDesabilitado]}
        onPress={() => void handleSalvar()}
        disabled={!canSave}
      >
        <Text style={styles.botaoSalvarTexto}>
          {loading
            ? "Salvando..."
            : initialValues
            ? "Atualizar Aviso"
            : "Criar Aviso"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, padding: 20 },
  botaoData: {
    backgroundColor: "#ebebeb",
    padding: 10,
    alignItems: "center",
    elevation: 5,
    flex: 1,
  },
  botaoDataTexto: { color: "black", fontSize: 16 },
  label: { fontWeight: "bold", fontSize: 16 },
  labelData: { fontWeight: "bold", fontSize: 16, flex: 1 },
  labelHora: { fontWeight: "bold", fontSize: 16, flex: 1 },
  picker: {
    backgroundColor: "#ebebeb",
    color: "black",
    textAlign: "center",
    elevation: 5,
  },
  input: {
    backgroundColor: "#ebebeb",
    padding: 10,
    borderRadius: 5,
    minHeight: 50,
    textAlignVertical: "top",
  },
  botaoSalvar: {
    backgroundColor: "#1b5e20",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 15,
    elevation: 5,
  },
  botaoSalvarTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  botaoDesabilitado: {
    backgroundColor: "#cccccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  row: { flexDirection: "row", gap: 10 },
});
