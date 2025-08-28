import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  Frequencia,
  NovaAulaNucleo,
} from "../../components/src/types/aulasNucleus";
import {
  criarAulaNucleo,
  atualizarAulaNucleo,
  buscarAulaPorId,
} from "../../components/src/services/aulasNucleusService";
import { useLocalSearchParams, router } from "expo-router";

export default function CreateNucleusScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [nucleusName, setNucleusName] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState("");
  const [frequencia, setFrequencia] = useState<Frequencia | "">("");

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

  const canSave =
    nucleusName.trim() && frequencia !== "" && !!local && !loading;
  useEffect(() => {
    if (!id) return;

    const carregarDados = async () => {
      try {
        const aula = await buscarAulaPorId(id);
        if (aula) {
          setNucleusName(aula.materia || "");
          setDescription(aula.descricao || "");
          setLocal(aula.local || "");
          setFrequencia(aula.frequencia || "");
          if (aula.dataHora instanceof Date) {
            setData(aula.dataHora);
            setHora(aula.dataHora);
          }
        }
      } catch (e: any) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Falha ao carregar núcleo",
        });
      }
    };

    carregarDados();
  }, [id]);

  const handleSave = async () => {
    if (!canSave) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos!",
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
      });
      return;
    }

    setLoading(true);
    try {
      const dados: NovaAulaNucleo = {
        materia: nucleusName.trim(),
        descricao: description.trim(),
        dataHora,
        local,
        frequencia: frequencia as Frequencia,
      };

      if (id) {
        await atualizarAulaNucleo(id, dados);
        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Núcleo atualizado!",
        });
      } else {
        await criarAulaNucleo(dados);
        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Núcleo criado!",
        });
      }
      setNucleusName("");
      setDescription("");
      setData(new Date());
      setHora(new Date());
      setLocal("");
      setFrequencia("");
      router.back();
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Erro", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {id ? "Editar Aula de Núcleo" : "Agendar Aula de Núcleo"}
      </Text>

      <Text style={styles.label}>Disciplina:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do núcleo"
        placeholderTextColor="#999"
        value={nucleusName}
        onChangeText={setNucleusName}
      />

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
        placeholder="Descrição do núcleo"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, !canSave && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!canSave}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : id ? "Atualizar Núcleo" : "Criar Núcleo"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#ebebeb",
    padding: 10,
    borderRadius: 5,
    minHeight: 50,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#1B4332",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  labelData: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  labelHora: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  botaoData: {
    backgroundColor: "#ebebeb",
    padding: 10,
    alignItems: "center",
    elevation: 5,
    flex: 1,
  },
  botaoDataTexto: {
    color: "black",
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#ebebeb",
    color: "black",
    textAlign: "center",
    elevation: 5,
  },
});
