import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
} from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
    const handleSupport = () => {
        Linking.openURL("mailto:samnsuporte@gmail.com");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🎓 SAMN</Text>

            <Image
                source={require("@/assets/images/nnn.jpg")}
                style={styles.illustration}
                resizeMode="contain"
            />

            <Text style={styles.description}>
                Organize, participe e transforme seu aprendizado.
            </Text>

            <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => {
                    router.push("/RegisterScreen");
                }}
            >
                <Text style={styles.buttonPrimaryText}>Cadastrar-se </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => {
                    router.push("/LoginScreen");
                }}
            >
                <Text style={styles.buttonSecondaryText}>Entrar </Text>
            </TouchableOpacity>

            <Text style={styles.supportLink} onPress={handleSupport}>
                Entre em contato com o suporte
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#fff",
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1B4332",
        marginBottom: 16,
    },
    illustration: {
        width: 250,
        height: 180,
        marginBottom: 24,
    },
    description: {
        textAlign: "center",
        fontSize: 16,
        color: "#333",
        marginBottom: 32,
    },
    buttonPrimary: {
        backgroundColor: "#1B4332",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginBottom: 12,
        width: "100%",
        alignItems: "center",
    },
    buttonPrimaryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonSecondary: {
        borderWidth: 1,
        borderColor: "#1B4332",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonSecondaryText: {
        color: "#1B4332",
        fontSize: 16,
        fontWeight: "bold",
    },
    supportLink: {
        marginTop: 24,
        fontSize: 14,
        color: "#1B4332",
        textDecorationLine: "underline",
    },
});
