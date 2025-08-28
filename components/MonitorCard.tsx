import { View, Text, StyleSheet } from "react-native";

interface MonitorCardProps {
  materia: string;
  nome_do_responsavel: string;
  matricula_do_responsavel: string;
  email_do_responsavel: string;
}

export default function MonitorCard({
  materia,
  nome_do_responsavel,
  matricula_do_responsavel,
  email_do_responsavel,
}: MonitorCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.materia}>Materia: {materia}</Text>
      <Text style={styles.nome}>
        Nome do Responsável: {nome_do_responsavel}
      </Text>
      <Text style={styles.matricula_do_responsavel}>
        Matricula do Responsável: {matricula_do_responsavel}
      </Text>
      <Text style={styles.email_do_responsavel}>
        Email do Responsável: {email_do_responsavel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
  },
  materia: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: "bold",
  },
  matricula_do_responsavel: {
    fontSize: 14,
    marginTop: 6,
  },
  email_do_responsavel: {
    fontSize: 14,
    marginTop: 6,
  },
  nome: {
    fontSize: 14,
    marginTop: 6,
  },
  tipo: {
    fontSize: 14,
    marginTop: 6,
  },
});
