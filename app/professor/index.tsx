import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import NoticeCard from "@/components/NoticeCard";
import ViewModeSelector from "@/components/ViewModeSelector";
import CustomCalendar from "@/components/CustomCalendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


LocaleConfig.locales["pt-br"] = {
    monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ],
    monthNamesShort: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
    ],
    dayNames: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const STORAGE_KEY = "@avisos_rules";

type FrequenciaType =
    | "Apenas uma vez"
    | "Uma vez por semana"
    | "Uma vez por mês"
    | "Uma vez por ano";

type AvisoRegraPersistida = {
    id: string;
    materia: string;
    data: string; // "dd/MM/yyyy" ou "yyyy-MM-dd"
    hora: string; // "HH:mm"
    descricao: string;
    frequencia: FrequenciaType;
    untilISO?: string; // data final em ISO opcional
    occurrences?: number; // limite opcional de vezes
    createdAt: string;
};

type StoredNotice = Omit<AvisoRegraPersistida, "untilISO" | "occurrences"> & {
    data: string; // "dd/MM/yyyy" data da ocorrência individual
    id: string; // id único para cada ocorrência (concat do id regra + índice)
};

export default function NoticeListScreen() {
    const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">(
        "monthly"
    );
    const [regras, setRegras] = useState<AvisoRegraPersistida[]>([]);
    const [notices, setNotices] = useState<StoredNotice[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const todayISO = new Date().toISOString().slice(0, 10);

    // Conversão genérica para Date (aceita dd/MM/yyyy ou yyyy-MM-dd)
    const parseToDate = (dateStr: string): Date => {
        if (!dateStr) return new Date();
        if (dateStr.includes("/")) {
            const [d, m, y] = dateStr.split("/");
            return new Date(Number(y), Number(m) - 1, Number(d));
        } else if (dateStr.includes("-")) {
            return new Date(dateStr);
        }
        return new Date(dateStr);
    };

    // Conversão Date => "dd/MM/yyyy"
    const formatBRDate = (date: Date): string => {
        const d = String(date.getDate()).padStart(2, "0");
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    // Expande regras recorrentes para ocorrências individuais
    const expandirRecorrencias = useCallback(
        (regras: AvisoRegraPersistida[]): StoredNotice[] => {
            const avisosExpandidos: StoredNotice[] = [];

            regras.forEach((regra) => {
                try {
                    const dataInicio = parseToDate(regra.data);
                    const frequencia = regra.frequencia;
                    const until = regra.untilISO ? new Date(regra.untilISO) : null;
                    const maxOcorrencias = regra.occurrences ?? 100; // limite padrão

                    let ocorrenciasGeradas = 0;
                    let currentDate = new Date(dataInicio);

                    while (ocorrenciasGeradas < maxOcorrencias) {
                        if (until && currentDate > until) break;

                        avisosExpandidos.push({
                            ...regra,
                            data: formatBRDate(currentDate),
                            id: regra.id + "_" + ocorrenciasGeradas,
                        });

                        ocorrenciasGeradas++;

                        if (frequencia === "Apenas uma vez") break;
                        if (frequencia === "Uma vez por semana")
                            currentDate.setDate(currentDate.getDate() + 7);
                        if (frequencia === "Uma vez por mês")
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        if (frequencia === "Uma vez por ano")
                            currentDate.setFullYear(currentDate.getFullYear() + 1);
                    }
                } catch (error) {
                    console.error("Erro ao expandir regra:", regra, error);
                }
            });

            return avisosExpandidos;
        },
        []
    );

    // Ao focar na tela, carrega regras e expande para avisos
    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    const stored = await AsyncStorage.getItem(STORAGE_KEY);
                    const regrasArmazenadas: AvisoRegraPersistida[] = stored
                        ? JSON.parse(stored)
                        : [];

                    setRegras(regrasArmazenadas);

                    const expandidos = expandirRecorrencias(regrasArmazenadas);

                    setNotices(expandidos);
                } catch (e) {
                    console.error("Erro ao carregar avisos:", e);
                    setRegras([]);
                    setNotices([]);
                }
            })();
        }, [expandirRecorrencias])
    );

    // Datas da semana atual em ISO
    const getCurrentWeekDates = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const week: string[] = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - dayOfWeek + i);
            const dateString = d.toISOString().slice(0, 10);
            week.push(dateString);
        }
        return week;
    };
    const weekDates = useMemo(() => getCurrentWeekDates(), []);

    // Função auxiliar para converter "dd/MM/yyyy" para ISO yyyy-MM-dd
    const brToISO = (br: string) => {
        const [d, m, y] = br.split("/");
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    };

    // Filtra avisos conforme view e data selecionada
    const filteredNotices = useMemo(() => {
        if (!selectedDate) return [];
        return notices.filter((n) => brToISO(n.data) === selectedDate);
    }, [selectedDate, notices]);

    const weeklyNotices = useMemo(() => {
        return notices.filter((n) => weekDates.includes(brToISO(n.data)));
    }, [notices, weekDates]);

    const dailyNotices = useMemo(() => {
        return notices.filter((n) => brToISO(n.data) === todayISO);
    }, [notices, todayISO]);

    // Monta os dias marcados no calendário
    const marked: {
        [date: string]: {
            marked?: boolean;
            dotColor?: string;
            selected?: boolean;
            selectedColor?: string;
            customStyles?: {
                container?: object;
                text?: object;
            };
        };
    } = {};

    for (const n of notices) {
        const iso = brToISO(n.data);
        marked[iso] = {
            ...(marked[iso] || {}),
            marked: true,
            dotColor: "#2196F3",
        };
    }

    if (selectedDate) {
        marked[selectedDate] = {
            ...(marked[selectedDate] || {}),
            selected: true,
            selectedColor: "#2196F3",
        };
    }

    marked[todayISO] = {
        ...(marked[todayISO] || {}),
        customStyles: {
            container: {
                backgroundColor: "#4CAF50",
            },
            text: {
                color: "white",
                fontWeight: "bold",
            },
        },
    };

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.container, { flex: 1 }]}>
                <ViewModeSelector
                    selected={
                        viewMode === "daily"
                            ? "Hoje"
                            : viewMode === "weekly"
                                ? "Semanal"
                                : "Mensal"
                    }
                    onChange={(mode) => {
                        if (mode === "Hoje") setViewMode("daily");
                        else if (mode === "Semanal") setViewMode("weekly");
                        else setViewMode("monthly");
                    }}
                />

                <CustomCalendar
                    visible={viewMode === "monthly"}
                    markedDates={marked}
                    onDateChange={(date) => setSelectedDate(date)}
                />

                <ScrollView style={[styles.container, { flex: 1 }]}>
                    {viewMode === "monthly" &&
                        filteredNotices.map((n) => (
                            <NoticeCard
                                key={n.id}
                                title={n.materia}
                                start={n.hora}
                                monitor={n.createdAt}
                                description={n.descricao}
                                date={brToISO(n.data)}
                            />
                        ))}

                    {viewMode === "weekly" &&
                        weeklyNotices.map((n) => (
                            <NoticeCard
                                key={n.id}
                                title={n.materia}
                                start={n.hora}
                                monitor={n.frequencia}
                                description={n.descricao}
                                date={brToISO(n.data)}
                            />
                        ))}

                    {viewMode === "daily" && dailyNotices.length === 0 && (
                        <Text
                            style={{ textAlign: "center", marginTop: 20, color: "black" }}
                        >
                            Nenhum aviso para hoje.
                        </Text>
                    )}
                    {viewMode === "daily" &&
                        dailyNotices.length > 0 &&
                        dailyNotices.map((n) => (
                            <NoticeCard
                                key={n.id}
                                title={n.materia}
                                start={n.hora}
                                description={n.descricao}
                                date={brToISO(n.data)}
                            />
                        ))}
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.floatingButton} onPress={() => {
                router.push('/screens/CreateNoticeScreen')
            }
            }>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    container: {
        marginHorizontal: 10,
    },
    title: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 24,
        marginBottom: 20,
        color: "black",
    },
    floatingButton: {
        position: "absolute",
        bottom: 40,
        right: 20,
        backgroundColor: "#185545",
        borderRadius: 50,
        padding: 15,
        elevation: 5,
    },
});
