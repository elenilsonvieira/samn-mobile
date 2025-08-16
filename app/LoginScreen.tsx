import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../components/src/fireBaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    // Remove espaços no início/fim e verifica se os campos estão vazios
    if (!matricula.trim() || !senha.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos corretamente!',
        text2: 'Não é permitido apenas espaços em branco.'
      });
      return;
    }

    try {
      // 1️⃣ Buscar email no Firestore pelo número de matrícula
      const q = query(collection(db, "usuarios"), where("matricula", "==", matricula.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Toast.show({ type: 'error', text1: 'Matrícula não encontrada!' });
        return;
      }

      const userData = snapshot.docs[0].data();
      const email = userData.email;

      // 2️⃣ Fazer login no Firebase Auth usando o email recuperado
      const userCredential = await signInWithEmailAndPassword(auth, email, senha.trim());
      const user = userCredential.user;

      Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });

      router.replace("/monitor");
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no login', text2: "A Senha informada não confere com a Matrícula informada" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Acadêmico</Text>

      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        style={styles.input}
        placeholder="000000000000"
        keyboardType="number-pad"
        maxLength={12}
        value={matricula}
        onChangeText={setMatricula}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Entre em contato com o suporte em caso de problemas
      </Text>

      {/* Botões de teste temporários */}
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/aluno")}>
        <Text style={styles.buttonText}>Aluno</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/monitor")}>
        <Text style={styles.buttonText}>Monitor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/professor")}>
        <Text style={styles.buttonText}>Professor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/coordenador")}>
        <Text style={styles.buttonText}>Coordenador</Text>
      </TouchableOpacity>
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
