import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../components/src/fireBaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    if (!matricula.trim() || !email.trim() || !senha.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos corretamente!',
        text2: 'Não é permitido apenas espaços em branco.'
      });
      return;
    }

    const matriculaRegex = /^[0-9]{12}$/;
    if (!matriculaRegex.test(matricula)) {
      Toast.show({
        type: 'error',
        text1: 'Matrícula inválida!',
        text2: 'A matrícula deve ter exatamente 12 dígitos numéricos.'
      });
      return;
    }

    const senhaRegex = /^[\w!@#$%^&*()\-_=+{};:,<.>]{8,12}$/;
    if (!senhaRegex.test(senha)) {
      Toast.show({
        type: 'error',
        text1: 'Senha inválida!',
        text2: 'A senha deve ter entre 8 e 12 caracteres e pode conter letras, números e caracteres especiais.'
      });
      return;
    }

    try {
      let tipo = "aluno"
    if (matricula.startsWith("20")) {
      tipo = "aluno";
    } else if (matricula.startsWith("10")) {
      tipo = "professor";
    } else if (matricula.startsWith("0")) {
      tipo = "coordenador";
    }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha.trim()
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        matricula: matricula.trim(),
        email: email.trim(),
        tipo,
        criadoEm: new Date().toISOString(),
      });

      Toast.show({ type: 'success', text1: 'Cadastro realizado com sucesso!' });

      router.push('/LoginScreen');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no cadastro', text2: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Acadêmico</Text>

      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        style={styles.input}
        placeholder="000000000000"
        keyboardType="number-pad"
        maxLength={12}
        value={matricula}
        onChangeText={setMatricula}
      />

      <Text style={styles.label}>E-mail Institucional</Text>
      <TextInput
        style={styles.input}
        placeholder="seunome@instituicao.edu.br"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Ao cadastrar, você concorda com nossos Termos de Uso
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
