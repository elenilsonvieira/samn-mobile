import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#f0f0f0",
          width: 240,
        },
        drawerType: "front",
        drawerActiveTintColor: "#185545",
        drawerInactiveTintColor: "#888",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "",
          headerStyle: { backgroundColor: "#185545" },
          headerTintColor: "#ffffff",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profiles/profile")}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={36}
                color="#ffffff"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="CreateMonitoria"
        options={{
          drawerLabel: "Criar Monitoria",
          title: "Agendamento de Monitoria",
          headerStyle: { backgroundColor: "#185545" },
          headerTintColor: "#ffffff",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/profiles/profile")}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={36}
                color="#ffffff"
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer>
  );
}
