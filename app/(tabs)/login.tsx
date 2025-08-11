import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Acadêmico</Text>

            <Text style={styles.label}>Matrícula</Text>
            <TextInput
                style={styles.input}
                placeholder="000000000000"
                keyboardType="number-pad"
                maxLength={12}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="••••••"
                secureTextEntry
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
                Entre em contato com o suporte em caso de problemas
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1B4332',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 12,
        color: '#495057',
        marginBottom: 8,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CED4DA',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        fontSize: 16,
        color: '#212529',
    },
    button: {
        backgroundColor: '#2D6A4F',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        fontSize: 12,
        color: '#6C757D',
        textAlign: 'center',
        marginTop: 24,
    },
});