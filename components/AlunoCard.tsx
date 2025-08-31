import { View, Text, StyleSheet } from "react-native";

interface AlunoCardProps {
  nome: string;
  matricula: string;
  email: string;
  tipo?: string;
}

export default function AlunoCard({
  nome,
  matricula,
  email,
  tipo,
}: AlunoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>Nome: {nome}</Text>
      <Text style={styles.matricula}>Matrícula: {matricula}</Text>
      <Text style={styles.email}>Email: {email}</Text>
      {tipo && <Text style={styles.tipo}>Tipo: {tipo}</Text>}
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
  nome: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: "bold",
  },
  matricula: {
    fontSize: 14,
    marginTop: 6,
  },
  email: {
    fontSize: 14,
    marginTop: 6,
  },
  tipo: {
    fontSize: 14,
    marginTop: 6,
    color: "#1B4332", 
  },
});
