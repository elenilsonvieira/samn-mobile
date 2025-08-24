import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={28} color="black" />
      </TouchableOpacity>

      {/* Avatar + informações */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          {/* Imagem genérica sem precisar de arquivo local */}
          <Image
            source={{ uri: "https://via.placeholder.com/60x60.png?text=👤" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Fulano de Tall</Text>
          <Text style={styles.email}>aluno@institucional.edu.br</Text>
          <Text style={styles.matricula}>201231230</Text>
        </View>
      </View>

      {/* Função */}
      <Text style={styles.role}>Aluno</Text>

      {/* Botão de sair */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="black" />
          <Text style={styles.logoutText}>Sair do aplicativo</Text>
        </TouchableOpacity>

        {/* Versão */}
        <Text style={styles.version}>Versão 0.0.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 40 },
  backButton: { marginBottom: 40 },
  profileContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarWrapper: {
    backgroundColor: "#F4E3C2",
    borderRadius: 50,
    padding: 10,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  infoContainer: { marginLeft: 15 },
  name: { fontSize: 20, fontWeight: "bold", color: "#000" },
  email: { color: "gray", marginTop: 2 },
  matricula: { color: "gray", marginTop: 2 },
  role: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  logoutText: { marginLeft: 8, fontWeight: "500", color: "#000" },
  version: { marginTop: 10, color: "gray", fontSize: 12 },
});
