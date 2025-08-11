import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import { IDisciplina } from '@/components/interfaces/IDisciplina';
import { IProfessor } from '@/components/interfaces/IProfessor';
import Header from '@/components/Header';

const professoresMock: IProfessor[] = [
    {
        id: 1,
        nome: 'Prof. Elenilson',
        email: 'Elenilson@exemplo.com',
        telefone: '11999999999',
        disciplinas: [],
    },
    {
        id: 2,
        nome: 'Prof. Rhavy',
        email: 'rhavy@exemplo.com',
        telefone: '11988888888',
        disciplinas: [],
    },
    {
        id: 3,
        nome: 'Prof. Gabriela',
        email: 'gabriela@exemplo.com',
        telefone: '11977777777',
        disciplinas: [],
    },
];

const CreateCourseScreen = () => {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [professorId, setProfessorId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const canSave = !!nome && !!codigo && !loading;

    const handleSalvar = async () => {
        if (!canSave) return;
        setLoading(true);

        try {
            const professorSelecionado = professoresMock.find(p => p.id === professorId!) || null;

            const novaDisciplina: IDisciplina = {
                id: Date.now(),
                nome,
                codigo,
                professoresResponsaveis: professorSelecionado ? [professorSelecionado] : [],
                monitor: {} as any,
                alunos: [],
            };

            console.log('Disciplina criada:', novaDisciplina);

            Toast.show({
                type: 'success',
                text1: 'Disciplina cadastrada com sucesso!',
            });

            setNome('');
            setCodigo('');
            setProfessorId(null);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar disciplina',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.title}>Cadastro de Disciplina</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome da Disciplina"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Código da Disciplina"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={codigo}
                        onChangeText={setCodigo}
                    />

                    <Text style={styles.label}>Professor Responsável (opcional)</Text>
                    <Picker
                        selectedValue={professorId}
                        onValueChange={(value) => setProfessorId(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Nenhum" value={null} />
                        {professoresMock.map((prof) => (
                            <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
                        ))}
                    </Picker>

                    <TouchableOpacity
                        style={[styles.botaoSalvar, !canSave && styles.botaoDesabilitado]}
                        onPress={handleSalvar}
                        disabled={!canSave}
                    >
                        <Text style={styles.botaoSalvarTexto}>
                            {loading ? 'Salvando...' : 'Cadastrar Disciplina'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#f9f9f9',
        flex: 1,
        paddingBottom: 5,
    },
    container: {
        backgroundColor: '#dedede',
        paddingTop: 5,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 20,
        gap: 12,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
    },
    label: {
        marginTop: 12,
        fontWeight: '500',
    },
    picker: {
        backgroundColor: '#ebebeb',
        color: '#000',
        borderRadius: 6,
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
    botaoDesabilitado: {
        backgroundColor: '#cccccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    botaoSalvarTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateCourseScreen;
