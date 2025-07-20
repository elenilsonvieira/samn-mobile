import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IMonitor } from '@/components/interfaces/IMonitor';

const monitores = [
    {
        matricula: '202313810003',
        nome: 'Vinicius',
        email: 'vinicius@gmail.com',
        disciplina: 'Banco de Dados',
        criadoEm: '2024-01-10',
    },
    {
        nome: 'Davi',
        email: 'davi@gmail.com',
        matricula: '202313810000',
        disciplina: 'Desenvolvimento Mobile',
        criadoEm: '2024-01-10',
    },
    {
        nome: 'Rafael',
        email: 'rafael@gmail.com',
        matricula: '202313810001',
        disciplina: 'Segurança da Informação',
        criadoEm: '2024-01-10',
    },
];

export default function MonitorsScreen() {
    const renderItem = ({ item }: {item: IMonitor}) => (
        <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Email:   {item.email}</Text>
            <Text>Id:    {item.matricula}</Text>
            <Text>Disciplina:    {item.disciplina}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <View style={styles.content}>
                <Text style={styles.titulo}>Monitores</Text>
                <FlatList
                    data={monitores}
                    keyExtractor={(item) => item.matricula}
                    renderItem={renderItem}
                    contentContainerStyle={styles.lista}
                />
            </View>

            <Footer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 12,
    },
    lista: {
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});