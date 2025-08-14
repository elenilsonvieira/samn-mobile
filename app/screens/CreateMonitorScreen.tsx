import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { IMonitor } from '@/components/interfaces/IMonitor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@monitores';

export default function CreateMonitorScreen() {
  const [monitores, setMonitores] = useState<IMonitor[]>([]);

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [horarios, setHorarios] = useState('');

  const [disciplinas, setDisciplinas] = useState([
    { nome: 'Banco de Dados I', selecionada: false },
    { nome: 'Estrutura de Dados', selecionada: false },
    { nome: 'Programação Orientada a Objetos', selecionada: false },
  ]);

  const [horariosD, sethorariosD] = useState([
    { nome: '13:00', selecionada: false },
    { nome: '15:00', selecionada: false },
    { nome: '17:00', selecionada: false },
  ]);

  useEffect(() => {
    // Carrega monitores salvos ao iniciar
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setMonitores(JSON.parse(stored));
    })();
  }, []);

  const toggleDisciplina = (index: number) => {
    const novasDisciplinas = disciplinas.map((disciplina, i) => ({
      ...disciplina,
      selecionada: i === index,
    }));
    setDisciplinas(novasDisciplinas);
  };

  const toggleHorario = (index: number) => {
    const novosHorarios = horariosD.map((horario, i) => ({
      ...horario,
      selecionada: i === index,
    }));
    sethorariosD(novosHorarios);
  };

  const handleSubmit = async () => {
    const disciplinaSelecionada = disciplinas.find(d => d.selecionada)?.nome || '';

    const newMonitor: IMonitor = {
      nome,
      matricula,
      email,
      curso,
      horariosDisponiveis: horarios,
      disciplina: disciplinaSelecionada,
      criadoEm: new Date().toISOString(),
    };

    const novaLista = [...monitores, newMonitor];
    setMonitores(novaLista);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

    // Limpar campos
    setNome('');
    setMatricula('');
    setEmail('');
    setCurso('');
    setHorarios('');
    setDisciplinas(prev => prev.map(d => ({ ...d, selecionada: false })));
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Monitor</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={nome}
              placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              value={matricula}
              placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
              onChangeText={setMatricula}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Curso"
              value={curso}
              placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
              onChangeText={setCurso}
            />

            <Text style={styles.subtitle}>Disciplinas:</Text>
            {disciplinas.map((disciplina, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxContainer}
                onPress={() => toggleDisciplina(index)}
              >
                <View style={[styles.checkbox, disciplina.selecionada && styles.checkboxSelected]} />
                <Text style={styles.checkboxLabel}>{disciplina.nome}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.subtitle}>Horários:</Text>
            {horariosD.map((horario, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxContainer}
                onPress={() => toggleHorario(index)}
              >
                <View style={[styles.checkbox, horario.selecionada && styles.checkboxSelected]} />
                <Text style={styles.checkboxLabel}>{horario.nome}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={handleSubmit}
              disabled={!nome}
            >
              <Text style={styles.botaoSalvarTexto}>Cadastrar Monitor</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  container: {
    backgroundColor: '#dedede',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ebebeb',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    minHeight: 60,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#444',
    marginRight: 10,
    borderRadius: 3,
  },
  checkboxSelected: {
    backgroundColor: '#1b5e20',
  },
  checkboxLabel: {
    fontSize: 16,
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
});
