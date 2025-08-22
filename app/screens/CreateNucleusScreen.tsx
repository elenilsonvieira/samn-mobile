import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { db, auth, nowTs } from "../../components/src/fireBaseConfig"; // importa Firebase
import { collection, addDoc, doc, getDoc} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Frequencia } from "../../components/src/types/aulasMonitoria";


async function obterPerfilUsuario(uid: string) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Perfil de Usuário não encontrado");
  return snap.data() as { matricula: string };
}


export default function CreateNucleusScreen() {
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
      "Sala 01", "Sala 02", "Sala 03", "Sala 04", "Sala 05",
      "Sala 06", "Sala 07", "Sala 08", "Sala 09", "Sala 10",
  ];

  const arrayFrequencia: Frequencia[] = ["Única", "Semanal", "Mensal", "Anual"];
  
  const canSave = frequencia !== "" && !!local && !loading;

  const handleCreate = async () => {
    if (!nucleusName.trim() || !frequencia) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos!",
      });
      return;
    }
    if (!local) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Selecione um local!",
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
      const user = auth.currentUser;
      if (!user) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Usuário não logado!",
        });
        return;
      }

      const perfil = await obterPerfilUsuario(user.uid);

      await addDoc(collection(db, "aulas_nucleo"), {
        matricula: perfil.matricula,
        uid: user.email,
        atualizadoEm: nowTs(),
        criadoEm: nowTs(),
        dataHora: dataHora,
        descricao: description.trim(),
        local: local,
        materia: nucleusName.trim(),
        frequencia: frequencia,
      });

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Núcleo criado com sucesso!",
      });

      setData(new Date());
      setHora(new Date());
      setLocal("");
      setNucleusName("");
      setDescription("");
      setFrequencia("");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao criar núcleo",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamento do Núcleo</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicione o nome do núcleo"
        placeholderTextColor="#999"
        value={nucleusName}
        onChangeText={setNucleusName}
      />

      <View style={styles.row}>
          <Text style={styles.labelData}>Data:</Text>
          <Text style={styles.labelHora}>Hora:</Text>
      </View>
      <View style={styles.row}>
          <TouchableOpacity style={styles.botaoData} onPress={() => setMostrarData(true)}>
              <Text style={styles.botaoDataTexto}>{data.toLocaleDateString("pt-BR")}</Text>
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

          <TouchableOpacity style={styles.botaoData} onPress={() => setMostrarHora(true)}>
              <Text style={styles.botaoDataTexto}>{hora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</Text>
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
      <Text></Text>
      <View style={styles.row}>
        <Text style={styles.labelData}>Local:</Text>
      </View>
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
      <Text></Text>
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
      <Text></Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Descrição do núcleo"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Criar </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "bold", fontSize: 16 },
  labelData: { fontWeight: "bold", fontSize: 16, flex: 1 },
  labelHora: { fontWeight: "bold", fontSize: 16, flex: 1 },
  row: { flexDirection: 'row', gap: 10 },
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
    backgroundColor: "#fff",
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
  botaoData: { backgroundColor: "#ebebeb", padding: 10,alignItems: "center", elevation: 5, flex: 1 },
  botaoDataTexto: { color: "black", fontSize: 16 },
  picker: { backgroundColor: "#ebebeb", color: "black", textAlign: "center", elevation: 5 },
});
