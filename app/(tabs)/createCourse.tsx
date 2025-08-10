import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import { IDisciplina } from '@/components/interfaces/IDisciplina';
import { IProfessor } from '@/components/interfaces/IProfessor';
import { IMonitor } from '@/components/interfaces/IMonitor';
import { IAluno } from '@/components/interfaces/IAluno';
import { ICurso } from '@/components/interfaces/ICurso';
import Header from '@/components/Header';

const cursosMock: ICurso[] = [
    {
        id: 1,
        nome: 'Sistemas de Informação',
        codigo: 'SI2024',
        listaAlunos: [],
        listaDisciplinas: [],
    },
    {
        id: 2,
        nome: 'Tecnólogo em Sistemas para Internet',
        codigo: 'TSI2024',
        listaAlunos: [],
        listaDisciplinas: [],
    },
];

const alunosMock: IAluno[] = [
    {
        id: 1,
        nome: 'Antonio David',
        matricula: 101,
        cpf: '12345678900',
        email: 'antonioDavid@email.com',
        telefone: '99999-0000',
        dataNascimento: '2005-07-30',
        status: 'ativo',
        curso: cursosMock[0],
        endereco: {
            rua: 'Rua da Matriz',
            numero: '172',
            bairro: 'Centro',
            cidade: 'Duas Estradas',
            estado: 'Paraíba',
            cep: '58265-000',
            complemento: 'casa ao lado do mirante',
        },
        historicoAgendamento: [],
    },
    {
        id: 2,
        nome: 'Rafael Rodrigues',
        matricula: 101,
        cpf: '12345678901',
        email: 'rafaelrodrigues@email.com',
        telefone: '99999-0000',
        dataNascimento: '2003-07-23',
        status: 'ativo',
        curso: cursosMock[0],
        endereco: {
            rua: 'Rua A',
            numero: '123',
            bairro: 'Centro',
            cidade: 'Guarabira',
            estado: 'Paraíba',
            cep: '00000-000',
            complemento: '',
        },
        historicoAgendamento: [],
    },
];

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

const monitoresMock: IMonitor[] = [
    {
        ...alunosMock[0],
        disciplina: {} as IDisciplina,
        disponibilidade: [
            {
                diaSemana: 'Segunda-feira',
                horarioInicio: '08:00',
                horarioFim: '10:00',
            },
        ],
    },
];

const CreateCourseScreen = () => {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [professorId, setProfessorId] = useState<number>(professoresMock[0].id);
    const [monitorId, setMonitorId] = useState<number>(monitoresMock[0].id);
    const [alunoId, setAlunoId] = useState<number>(alunosMock[0].id);
    const [loading, setLoading] = useState(false);

    const canSave = !!nome && !!codigo && !!professorId && !!monitorId && !!alunoId && !loading;

    const handleSalvar = async () => {
        if (!canSave) return;
        setLoading(true);

        try {
            const professorSelecionado = professoresMock.find(p => p.id === professorId)!;
            const monitorSelecionado = monitoresMock.find(m => m.id === monitorId)!;
            const alunoSelecionado = alunosMock.find(a => a.id === alunoId)!;

            const novaDisciplina: IDisciplina = {
                id: Date.now(),
                nome,
                codigo,
                professoresResponsaveis: [professorSelecionado],
                monitor: monitorSelecionado,
                alunos: [alunoSelecionado],
            };

            professorSelecionado.disciplinas.push(novaDisciplina);

            monitorSelecionado.disciplina = novaDisciplina;

            Toast.show({
                type: 'success',
                text1: 'Disciplina cadastrada com sucesso!',
            });

            // Resetar campos
            setNome('');
            setCodigo('');
            setProfessorId(professoresMock[0].id);
            setMonitorId(monitoresMock[0].id);
            setAlunoId(alunosMock[0].id);
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

                    <Text style={styles.label}>Professor Responsável</Text>
                    <Picker
                        selectedValue={professorId}
                        onValueChange={(value) => setProfessorId(value)}
                        style={styles.picker}
                    >
                        {professoresMock.map((prof) => (
                            <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
                        ))}
                    </Picker>

                    <Text style={styles.label}>Monitor</Text>
                    <Picker
                        selectedValue={monitorId}
                        onValueChange={(value) => setMonitorId(value)}
                        style={styles.picker}
                    >
                        {alunosMock.map((m) => (
                            <Picker.Item key={m.id} label={m.nome} value={m.id} />
                        ))}
                    </Picker>

                    <Text style={styles.label}>Aluno</Text>
                    <Picker
                        selectedValue={alunoId}
                        onValueChange={(value) => setAlunoId(value)}
                        style={styles.picker}
                    >
                        {alunosMock.map((a) => (
                            <Picker.Item key={a.id} label={a.nome} value={a.id} />
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
