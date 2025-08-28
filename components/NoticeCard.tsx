import { View, Text, StyleSheet } from "react-native";

function formatDateBR(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

interface NoticeCardProps {
  title: string;
  start: string;
  description: string;
  matricula_do_responsavel: string;
  email_do_responsavel: string;
  date: string;
  local: string;
  nome: string;
  tipo: string;
}

export default function NoticeCard({
  title,
  start,
  matricula_do_responsavel,
  email_do_responsavel,
  description,
  date,
  local,
  nome,
  tipo,
}: NoticeCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Aula de {title} {date ? `(${formatDateBR(date)})` : ""}
      </Text>
      <Text style={styles.tipo}>{tipo}</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Início: {start}</Text>
      </View>
      <Text style={styles.description}>Descrição: {description}</Text>
      <Text style={styles.local}>Local: {local}</Text>
      <Text style={styles.nome}>Nome do Responsável: {nome}</Text>
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  description: {
    fontSize: 14,
    marginTop: 6,
  },
  local: {
    fontSize: 14,
    marginTop: 6,
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
