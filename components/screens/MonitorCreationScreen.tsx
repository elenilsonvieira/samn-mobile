import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function CadastroMonitorScreen() {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [email, setEmail] = useState('');
    const [curso, setCurso] = useState('');
    const [horarios, setHorarios] = useState('');
    const [senha, setSenha] = useState('');

    const [disciplinas, setDisciplinas] = useState([
        { nome: 'Matemática', selecionada: false },
        { nome: 'Física', selecionada: false },
        { nome: 'Química', selecionada: false },
    ]);

    const toggleDisciplina = (index) => {
        const novasDisciplinas = [...disciplinas];
        novasDisciplinas[index].selecionada = !novasDisciplinas[index].selecionada;
        setDisciplinas(novasDisciplinas);
    };

    const handleSubmit = () => {
        const disciplinasSelecionadas = disciplinas
            .filter(d => d.selecionada)
            .map(d => d.nome);

        const monitorData = {
            nome,
            matricula,
            email,
            curso,
            horarios,
            senha,
            disciplinas: disciplinasSelecionadas,
        };

        console.log(monitorData);
        Alert.alert('Monitor cadastrado com sucesso!');

        // Limpa os campos
        setNome('');
        setMatricula('');
        setEmail('');
        setCurso('');
        setHorarios('');
        setSenha('');
        setDisciplinas(prev => prev.map(d => ({ ...d, selecionada: false })));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cadastro de Monitor</Text>

            <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Matrícula" value={matricula} onChangeText={setMatricula} />
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Curso" value={curso} onChangeText={setCurso} />

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

            <TextInput style={styles.input} placeholder="Horários disponíveis" value={horarios} onChangeText={setHorarios} />
            <TextInput style={styles.input} placeholder="Senha inicial" value={senha} onChangeText={setSenha} secureTextEntry />

            <Button title="Cadastrar Monitor" onPress={handleSubmit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
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
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
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
        backgroundColor: '#4caf50',
    },
    checkboxLabel: {
        fontSize: 16,
    },
});
