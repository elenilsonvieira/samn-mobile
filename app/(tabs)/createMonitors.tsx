import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from "@/components/Header";
import { IMonitor } from '@/components/interfaces/IMonitor';



export default function RegisterMonitorScreen() {
    const [monitores, setMonitores] = useState<IMonitor[]>([]);

    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [email, setEmail] = useState('');
    const [curso, setCurso] = useState('');
    const [horarios, setHorarios] = useState('');
    const [senha, setSenha] = useState('');

    const [disciplinas, setDisciplinas] = useState([
        { nome: 'Banco de Dados I', selecionada: false },
        { nome: 'Estrutura de Dados', selecionada: false },
        { nome: 'Química', selecionada: false },
    ]);


    const toggleDisciplina = (index:number) => {
        const novasDisciplinas = disciplinas.map((disciplina, i) => ({
            ...disciplina,
            selecionada: i === index,
        }));
        setDisciplinas(novasDisciplinas);
    };

    const handleSubmit = async () => {
        const disciplinaSelecionada = disciplinas.find(d => d.selecionada)?.nome || '';

        const newMonitor: IMonitor = {
            nome,
            matricula,
            email,
            curso,
            horariosDisponiveis: horarios,
            senha,
            disciplina: disciplinaSelecionada,
            criadoEm: new Date().toISOString(),
        };

        setMonitores((prev) => {
            return [...prev, newMonitor]
        });

        setNome('');
        setMatricula('');
        setEmail('');
        setCurso('');
        setHorarios('');
        setSenha('');
        setDisciplinas(prev => prev.map(d => ({ ...d, selecionada: false })));
    };

    return (
        <View style={styles.mainContainer}>
            <Header />
            <View style={styles.backContainer}>
                <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Cadastro de Monitor</Text>

                    <TextInput style={styles.input} 
                        placeholder="Nome completo" 
                        value={nome}
                        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                        onChangeText={setNome} 
                    />
                    <TextInput style={styles.input} 
                        placeholder="Matrícula" 
                        value={matricula} 
                        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                        onChangeText={setMatricula}
                    />
                    <TextInput style={styles.input} 
                        placeholder="E-mail" 
                        value={email} 
                        onChangeText={setEmail}
                        placeholderTextColor={'rgba(0, 0, 0, 0.5)'} 
                        keyboardType="email-address" 
                    />
                    <TextInput style={styles.input} 
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

                    <TextInput style={styles.input} 
                        placeholder="Horários disponíveis" 
                        value={horarios} 
                        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                        onChangeText={setHorarios}
                    />
                    <TextInput style={styles.input} 
                        placeholder="Senha inicial" 
                        value={senha} 
                        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                        onChangeText={setSenha} secureTextEntry
                    />

                    <TouchableOpacity
                            style={styles.botaoSalvar}
                            onPress={handleSubmit}
                            disabled={!nome}
                          >
                            <Text style={styles.botaoSalvarTexto}>Cadastrar Monitor</Text>
                          </TouchableOpacity>
                </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#f9f9f9',
        flex: 1,
    },
    backContainer: {
        backgroundColor: '#f9f9f9',
        paddingTop: 25,
        flex: 1,
    },
    container: {
        backgroundColor: '#dedede',
        paddingTop: 5,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 20,
        paddingBottom: 4,
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
