
import React, {useState} from "react";
import { Image, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";

export default function Footer() {
    const [novoCampo, setNovoCampo] = useState('');

    return (
            <View style={styles.row}>
                <TouchableOpacity>
                    <Image
                    source={require('@/assets/images/conta.png')}
                    style={{ marginStart: 7, width: 40, height: 40 }}
                    />
                </TouchableOpacity>
                <TextInput style={styles.input}
                    placeholder="Digite algo aqui..."
                    placeholderTextColor="#999"
                    value={novoCampo}
                    onChangeText={setNovoCampo}>
                </TextInput>
                <TouchableOpacity>
                    <Image
                        source={require('@/assets/images/sino.png')}
                        style={{ marginEnd: 7, width: 40, height: 40 }}
                    />
                </TouchableOpacity>
            </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 10,
        fontSize: 16,
        color: '#fff',
        width: '60%',
        backgroundColor: '#f9f9f9',
    },
    row: {
        marginTop: 35,
        backgroundColor: '#185545',
        width: '100%',
        height: 80,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});