import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
    </>
  );
}

/* import { Drawer } from 'expo-router/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) return null;

    return (
        <>
            <Drawer>
                <Drawer.Screen
                    name="index"
                    options={{ drawerLabel: 'index' }}
                />
                <Drawer.Screen
                    name="NoticeListScreen"
                    options={{
                        drawerLabel: "Início",
                        title: 'Início',
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('Conta pressionada');
                                }}
                                style={{ marginRight: 15 }}
                            >
                                <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
                            </TouchableOpacity>),
                    }}
                />
            </Drawer>
            <Toast />
            <StatusBar style="auto" />
        </>
    );
}
 */
