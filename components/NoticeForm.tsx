//NoticeForm
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, StyleSheet, View, Text, TextInput, TouchableOpacity, } from "react-native";

export type DadosAvisoRecorrente = {
    materia: string;
    data: string;
    hora: string;
    localidade: string;
    descricao: string;
    frequencia: "Apenas uma vez" | "Uma vez por semana" | "Uma vez por mês" | "Uma vez por ano";
    untilISO?: string;
    occurrences?: number;
};

type AvisoFormProps = {
    onSalvar: (dados: DadosAvisoRecorrente) => void | Promise<void>;
};

export default function AvisoForm({ onSalvar }: AvisoFormProps) {
    const [materia, setMateria] = useState("");
    const [data, setData] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [localidade, setLocalidade] = useState("");
    const [descricao, setDescricao] = useState("");
    const [frequencia, setFrequencia] = useState<
        "Apenas uma vez" | "Uma vez por semana" | "Uma vez por mês" | "Uma vez por ano" | ""
    >("");

    // Campos adicionais para recorrência
    const [untilDate, setUntilDate] = useState<Date | null>(null);
    const [showUntil, setShowUntil] = useState(false);
    const [occurrences, setOccurrences] = useState<string>("");

    const [mostrarData, setMostrarData] = useState(false);
    const [mostrarHora, setMostrarHora] = useState(false);
    const [loading, setLoading] = useState(false);

    const materiasDisponiveis = [
        "Algoritmos",
        "Cálculo I",
        "Estrutura de Dados",
        "Banco de Dados",
        "Sistemas Operacionais",
    ];

    const locais = [
        "Sala 01",
        "Sala 02",
        "Sala 02",
        "Sala 03",
        "Sala 04",
        "Sala 05",
        "Sala 06",
        "Sala 07",
        "Sala 08",
        "Sala 09",
        "Sala 10",
        "Sala 11",
        "Sala 12",
    ];

    const arrayFrequencia = [
        "Apenas uma vez",
        "Uma vez por semana",
        "Uma vez por mês",
        "Uma vez por ano",
    ];

    const canSave = !!materia && !!descricao && frequencia !== "" && !loading;


    const handleSalvar = async () => {
        if (!canSave) return;
        const agora = new Date();

        // Valida se a data é passada
        if (data.setHours(0, 0, 0, 0) < agora.setHours(0, 0, 0, 0)) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Não é possivel selecionar uma data que já passou!",
                position: "top",
            });
            return;
        }

        // Valida hora passada no mesmo dia
        if (data.toDateString() === agora.toDateString() && hora <= agora) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Não é possível selecionar um horário que já passou!",
                position: "top",
            });
            return;
        }

        setLoading(true);
        try {
            const dataFormatada = data.toLocaleDateString("pt-BR");
            const horaFormatada = hora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            });

            await onSalvar({
                materia,
                data: dataFormatada,
                hora: horaFormatada,
                localidade,
                descricao,
                frequencia: frequencia as DadosAvisoRecorrente["frequencia"],
                untilISO: untilDate ? untilDate.toISOString() : undefined,
                occurrences: occurrences ? Number(occurrences) : undefined,
            });

            // Reset do form
            setMateria("");
            setDescricao("");
            setFrequencia("");
            setData(new Date());
            setHora(new Date());
            setUntilDate(null);
            setOccurrences("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            {/* MATÉRIA */}
            <Text style={styles.label}>Disciplina:</Text>
            <Picker
                selectedValue={materia}
                onValueChange={(itemValue) => setMateria(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Selecione uma matéria" value="" />
                {materiasDisponiveis.map((m, index) => (
                    <Picker.Item key={index} label={m} value={m} />
                ))}
            </Picker>

            {/* DATA */} {/* Hora */}
            <View style={styles.row}>
                <Text style={styles.labelData}>Data:</Text>
                <Text style={styles.labelHora}>Hora:</Text>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.botaoData}
                    onPress={() => setMostrarData(true)}
                >
                    <Text style={styles.botaoDataTexto}>
                        {data.toLocaleDateString("pt-BR")}
                    </Text>
                </TouchableOpacity>
                {mostrarData && (
                    <DateTimePicker
                        value={data}
                        mode="date"
                        minimumDate={new Date()} // bloqueia datas passadas
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(_, selectedDate) => {
                            setMostrarData(false);
                            if (selectedDate) setData(selectedDate);
                        }}
                    />
                )}

                <TouchableOpacity
                    style={styles.botaoData}
                    onPress={() => setMostrarHora(true)}
                >
                    <Text style={styles.botaoDataTexto}>
                        {hora.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </TouchableOpacity>
                {mostrarHora && (
                    <DateTimePicker
                        value={hora}
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(_, selectedTime) => {
                            setMostrarHora(false);
                            if (selectedTime) {
                                const agora = new Date();
                                const mesmaData =
                                    data.toDateString() === agora.toDateString();

                                if (mesmaData && selectedTime <= agora) {
                                    Toast.show({
                                        type: "error",
                                        text1: "Erro",
                                        text2: "Não é possível selecionar um horário que já passou!",
                                        position: "top",
                                    });
                                    return;
                                }
                                setHora(selectedTime);
                            }
                        }}
                    />
                )}
            </View>


            {/* Localidade */}
            <Text style={styles.label}>Local:</Text>
            <Picker
                selectedValue={localidade}
                onValueChange={(itemValue) => setLocalidade(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Selecione um local" value="" />
                {locais.map((local, index) => (
                    <Picker.Item key={index} label={local} value={local} />
                ))}
            </Picker>

            {/* FREQUÊNCIA */}
            <Text style={styles.label}>Frequência:</Text>
            <Picker
                selectedValue={frequencia}
                onValueChange={(itemValue) => setFrequencia(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Frequência que essa aula irá acontecer" value="" />
                {arrayFrequencia.map((f, index) => (
                    <Picker.Item key={index} label={f} value={f} />
                ))}
            </Picker>

            {/* CAMPOS EXTRAS PARA RECORRÊNCIA */}
            {frequencia !== "" && frequencia !== "Apenas uma vez" && (
                <>
                    <Text style={styles.label}>Repetir até (opcional):</Text>
                    <TouchableOpacity
                        style={styles.botaoData}
                        onPress={() => setShowUntil(true)}
                    >
                        <Text style={styles.botaoDataTexto}>
                            {untilDate
                                ? untilDate.toLocaleDateString("pt-BR")
                                : "Selecionar data"}
                        </Text>
                    </TouchableOpacity>
                    {showUntil && (
                        <DateTimePicker
                            value={untilDate ?? new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(_, d) => {
                                setShowUntil(false);
                                setUntilDate(d ?? null);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Quantidade de ocorrências (opcional):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 12"
                        keyboardType="number-pad"
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        value={occurrences}
                        onChangeText={setOccurrences}
                    />
                </>
            )}

            {/* DESCRIÇÃO */}
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Assunto da monitoria, extras, etc."
                placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                value={descricao || ""}
                onChangeText={setDescricao}
                multiline
            />

            {/* BOTÃO */}
            <TouchableOpacity
                style={[styles.botaoSalvar, !canSave && styles.botaoDesabilitado]}
                onPress={() => void handleSalvar()}
                disabled={!canSave}
            >
                <Text style={styles.botaoSalvarTexto}>
                    {loading ? "Salvando..." : "Criar Aviso"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        padding: 20,
    },
    botaoData: {
        backgroundColor: "#ebebeb",
        padding: 10,
        alignItems: "center",
        elevation: 5,
        flex: 1
    },
    botaoDataTexto: {
        color: "black",
        fontSize: 16,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
    },
    labelData: {
        fontWeight: "bold",
        fontSize: 16,
        flex: 1,
    },
    labelHora: {
        fontWeight: "bold",
        fontSize: 16,
        flex: 1,
    },
    picker: {
        backgroundColor: "#ebebeb",
        color: "black",
        textAlign: "center",
        elevation: 5,
    },
    input: {
        backgroundColor: "#ebebeb",
        padding: 10,
        borderRadius: 5,
        minHeight: 50,
        textAlignVertical: "top",
    },
    botaoSalvar: {
        backgroundColor: "#1b5e20",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 15,
        elevation: 5,
    },
    botaoSalvarTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    botaoDesabilitado: {
        backgroundColor: "#cccccc",
        shadowOpacity: 0,
        elevation: 0,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    }
});