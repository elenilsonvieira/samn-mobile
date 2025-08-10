import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

import { IAluno } from '@/components/interfaces/IAluno';
import { ICurso } from '@/components/interfaces/ICurso';
import Header from '@/components/Header';

const cursosMock: ICurso[] = [
    { id: 1, nome: 'Sistemas de Informação', codigo: 'SI2024', listaAlunos: [], listaDisciplinas: [] },
    { id: 2, nome: 'Engenharia de Software', codigo: 'ES2024', listaAlunos: [], listaDisciplinas: [] },
];

const statusOptions: IAluno['status'][] = ['ativo', 'trancado', 'formado', 'desvinculado'];


const CreateStudentScreen = () => {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [status, setStatus] = useState<IAluno['status']>('ativo');
    const [cursoSelecionado, setCursoSelecionado] = useState<ICurso>(cursosMock[0]);
    const [loading, setLoading] = useState(false);
    

    const [endereco, setEndereco] = useState({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
    });

    const handleSubmit = () => {
        const novoAluno: IAluno = {
            id: Date.now(),
            nome,
            matricula: Number(matricula),
            cpf,
            email,
            telefone,
            dataNascimento,
            status,
            curso: cursoSelecionado,
            endereco,
            historicoAgendamento: [],
        };
    };

    const canSave =
        !!nome &&
        !!matricula &&
        !!cpf &&
        !!email &&
        !!telefone &&
        !!dataNascimento &&
        !!cursoSelecionado &&
        !loading;

    const handleSalvar = async () => {
        if (!canSave) return;

        setLoading(true);
        try {
            const novoAluno: IAluno = {
                id: Date.now(),
                nome,
                matricula: Number(matricula),
                cpf,
                email,
                telefone,
                dataNascimento,
                status,
                curso: cursoSelecionado,
                endereco,
                historicoAgendamento: [],
            };

            Toast.show({
                type: 'success',
                text1: 'Aluno cadastrado com sucesso!',
            });

            // Resetar campos
            setNome('');
            setMatricula('');
            setCpf('');
            setEmail('');
            setTelefone('');
            setDataNascimento('');
            setStatus('ativo');
            setCursoSelecionado(cursosMock[0]);
            setEndereco({
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
                complemento: '',
            });

        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar aluno',
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
                <Text style={styles.title}>Cadastro de Aluno</Text>

                    <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={nome} onChangeText={setNome} />
                    <TextInput style={styles.input} placeholder="Matrícula" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={matricula} onChangeText={setMatricula} keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="CPF" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={cpf} onChangeText={setCpf} />
                    <TextInput style={styles.input} placeholder="Email" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
                    <TextInput style={styles.input} placeholder="Data de Nascimento" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={dataNascimento} onChangeText={setDataNascimento} />

                <Text style={styles.label}>Curso</Text>
                <Picker
                    selectedValue={cursoSelecionado.id}
                    onValueChange={(itemValue) => {
                        const curso = cursosMock.find(c => c.id === itemValue);
                        if (curso) setCursoSelecionado(curso);
                    }}
                    style={styles.picker}
                >
                    {cursosMock.map((curso) => (
                        <Picker.Item key={curso.id} label={curso.nome} value={curso.id} />
                    ))}
                </Picker>

                <Text style={styles.label}>Status</Text>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.picker}
                >
                    {statusOptions.map((opt) => (
                        <Picker.Item key={opt} label={opt} value={opt} />
                    ))}
                </Picker>

                <Text style={styles.subtitle}>Endereço</Text>
                    <TextInput style={styles.input} placeholder="Rua" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.rua} onChangeText={(v) => setEndereco({ ...endereco, rua: v })} />
                    <TextInput style={styles.input} placeholder="Número" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.numero} onChangeText={(v) => setEndereco({ ...endereco, numero: v })} />
                    <TextInput style={styles.input} placeholder="Bairro" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.bairro} onChangeText={(v) => setEndereco({ ...endereco, bairro: v })} />
                    <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.cidade} onChangeText={(v) => setEndereco({ ...endereco, cidade: v })} />
                    <TextInput style={styles.input} placeholder="Estado" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.estado} onChangeText={(v) => setEndereco({ ...endereco, estado: v })} />
                    <TextInput style={styles.input} placeholder="CEP" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.cep} onChangeText={(v) => setEndereco({ ...endereco, cep: v })} />
                    <TextInput style={styles.input} placeholder="Complemento (opcional)" placeholderTextColor={"rgba(0, 0, 0, 0.5)"} value={endereco.complemento} onChangeText={(v) => setEndereco({ ...endereco, complemento: v })} />

                <TouchableOpacity
                    style={[styles.botaoSalvar, !canSave && styles.botaoDesabilitado]}
                    onPress={()=> void handleSalvar()}
                    disabled={!canSave}
                >
                    <Text style={styles.botaoSalvarTexto}>
                        {loading ? "Salvando..." : "Cadastrar Aluno"}
                    </Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#f9f9f9",
        flex: 1,
        paddingBottom: 5
    },
    backContainer: {
        padding: 25,
        flex: 1,
    },
    container:{
        backgroundColor: "#dedede",
        paddingTop: 5,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 20,
        gap: 12,
        paddingBottom: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
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
        color: "#000",
        borderRadius: 6,
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
    botaoDesabilitado: {
        backgroundColor: "#cccccc",
        shadowOpacity: 0,
        elevation: 0,
    },
    botaoSalvarTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CreateStudentScreen;