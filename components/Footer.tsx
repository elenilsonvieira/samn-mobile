import React from "react";
import { View, StyleSheet } from "react-native";

export default function Footer() {
    return (
        <View style={styles.footer}>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#dedede',
        width: '100%',
        height: '10%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#333',
        fontWeight: 'bold',
    },
});
