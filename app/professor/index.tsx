import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import NoticeCard from "@/components/NoticeCard";
import ViewModeSelector from "@/components/ViewModeSelector";
import CustomCalendar from "@/components/CustomCalendar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../components/src/fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

type FrequenciaType = "Única" | "Semanal" | "Mensal" | "Anual";

type AvisoRegraPersistida = {
  id: string;
  materia: string;
  data: string;
  hora: string;
  descricao: string;
  frequencia: FrequenciaType;
  untilISO?: string;
  occurrences?: number;
  createdAt: string;
  local: string;
  email: string;
  matricula: string;
  tipo: "monitoria" | "nucleo"; // NOVO: identifica o tipo
};

type StoredNotice = Omit<AvisoRegraPersistida, "untilISO" | "occurrences"> & {
  data: string;
  id: string;
};

export default function NoticeListScreen() {
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">("monthly");
  const [regras, setRegras] = useState<AvisoRegraPersistida[]>([]);
  const [notices, setNotices] = useState<StoredNotice[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayISO = new Date().toISOString().slice(0, 10);

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

  const formatBRDate = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const expandirRecorrencias = useCallback((regras: AvisoRegraPersistida[]): StoredNotice[] => {
    const avisosExpandidos: StoredNotice[] = [];
    regras.forEach((regra) => {
      try {
        const dataInicio = parseToDate(regra.data);
        const frequencia = regra.frequencia;
        const until = regra.untilISO ? new Date(regra.untilISO) : null;
        const maxOcorrencias = regra.occurrences ?? 20;

        if (frequencia === "Única") {
          avisosExpandidos.push({ ...regra, data: formatBRDate(dataInicio), id: regra.id + "_0" });
          return;
        }

        let ocorrenciasGeradas = 0;
        let currentDate = new Date(dataInicio);

        while (ocorrenciasGeradas < maxOcorrencias) {
          if (until && currentDate > until) break;
          avisosExpandidos.push({ ...regra, data: formatBRDate(currentDate), id: regra.id + "_" + ocorrenciasGeradas });
          ocorrenciasGeradas++;
          if (frequencia === "Semanal") currentDate.setDate(currentDate.getDate() + 7);
          else if (frequencia === "Mensal") currentDate.setMonth(currentDate.getMonth() + 1);
          else if (frequencia === "Anual") currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
      } catch (error) {
        console.error("Erro ao expandir regra:", regra, error);
      }
    });
    return avisosExpandidos;
  }, []);

  // Listener em tempo real para monitoria e núcleos
  useFocusEffect(
    useCallback(() => {
      const unsubscribeMonitoria = onSnapshot(
        collection(db, "aulas_monitoria"),
        (snapshot) => {
          const monitorias: AvisoRegraPersistida[] = snapshot.docs.map((doc) => {
            const raw = doc.data();
            const dataHora: Date | null = raw.dataHora?.toDate ? raw.dataHora.toDate() : null;
            return {
              id: doc.id,
              materia: raw.materia,
              data: dataHora ? formatBRDate(dataHora) : "",
              hora: dataHora ? `${String(dataHora.getHours()).padStart(2, "0")}:${String(dataHora.getMinutes()).padStart(2, "0")}` : "",
              descricao: raw.descricao || "",
              frequencia: raw.frequencia || "Única",
              createdAt: raw.criadoEm?.toDate ? raw.criadoEm.toDate().toISOString() : raw.criadoEm,
              local: raw.local || "",
              matricula: raw.Matricula || "",
              email: raw.Uid || "",
              tipo: "monitoria",
            };
          }) as AvisoRegraPersistida[];

          setRegras((prev) => {
            const others = prev.filter((r) => r.tipo !== "monitoria"); // remove monitorias antigas
            const combined = [...others, ...monitorias];
            const expandidos = expandirRecorrencias(combined);
            setNotices(expandidos);
            return combined;
          });
        }
      );

      const unsubscribeNucleos = onSnapshot(
        collection(db, "aulas_nucleo"),
        (snapshot) => {
          const nucleos: AvisoRegraPersistida[] = snapshot.docs.map((doc) => {
            const raw = doc.data();
            const dataHora: Date | null = raw.dataHora?.toDate ? raw.dataHora.toDate() : null;
            return {
              id: doc.id,
              materia: raw.materia,
              data: dataHora ? formatBRDate(dataHora) : "",
              hora: dataHora ? `${String(dataHora.getHours()).padStart(2, "0")}:${String(dataHora.getMinutes()).padStart(2, "0")}` : "",
              descricao: raw.descricao || "",
              frequencia: raw.frequencia ||"Única",
              createdAt: raw.criadoEm?.toDate ? raw.criadoEm.toDate().toISOString() : raw.criadoEm,
              local: raw.local || "",
              matricula: raw.matricula || "",
              email: raw.uid || "",
              tipo: "nucleo",
            };
          }) as AvisoRegraPersistida[];

          setRegras((prev) => {
            const others = prev.filter((r) => r.tipo !== "nucleo"); // remove núcleos antigos
            const combined = [...others, ...nucleos];
            const expandidos = expandirRecorrencias(combined);
            setNotices(expandidos);
            return combined;
          });
        }
      );

      return () => {
        unsubscribeMonitoria();
        unsubscribeNucleos();
      };
    }, [expandirRecorrencias])
  );

  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - dayOfWeek + i);
      week.push(d.toISOString().slice(0, 10));
    }
    return week;
  };

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  const brToISO = (br: string) => {
    const [d, m, y] = br.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const filteredNotices = useMemo(() => {
    if (!selectedDate) return [];
    return notices.filter((n) => brToISO(n.data) === selectedDate);
  }, [selectedDate, notices]);

  const weeklyNotices = useMemo(() => notices.filter((n) => weekDates.includes(brToISO(n.data))), [notices, weekDates]);
  const dailyNotices = useMemo(() => notices.filter((n) => brToISO(n.data) === todayISO), [notices, todayISO]);

  const marked: { [date: string]: any } = {};

  for (const n of notices) {
    const iso = brToISO(n.data);

    if (!marked[iso]) marked[iso] = { marked: true, dotColor: "" };

    // Se já existe algum evento marcado
    if (marked[iso].dotColor) {
      // Se já tinha monitoria e agora é núcleo → verde
      if (
        (marked[iso].dotColor === "#2196F3" && n.tipo === "nucleo") ||
        (marked[iso].dotColor === "#FFD700" && n.tipo === "monitoria")
      ) {
        marked[iso].dotColor = "#4CAF50"; // verde
      }
      // Se já era verde, mantém verde
    } else {
      // Primeiro evento do dia
      marked[iso].dotColor = n.tipo === "monitoria" ? "#2196F3" : "#FFD700";
    }
  }

  // Marca a data selecionada
  if (selectedDate) marked[selectedDate] = { ...(marked[selectedDate] || {}), selected: true, selectedColor: "#2196F3"};

  // Marca hoje com fundo verde, se quiser
  marked[todayISO] = {
    ...(marked[todayISO] || {}),
    customStyles: { container: { backgroundColor: "#355536" }, text: { color: "white", fontWeight: "bold" } },
  };


  return (
    <View style={styles.mainContainer}>
      <View style={[styles.container, { flex: 1 }]}>
        <ViewModeSelector
          selected={viewMode === "daily" ? "Hoje" : viewMode === "weekly" ? "Semanal" : "Mensal"}
          onChange={(mode) => {
            if (mode === "Hoje") setViewMode("daily");
            else if (mode === "Semanal") setViewMode("weekly");
            else setViewMode("monthly");
          }}
        />

        <CustomCalendar visible={viewMode === "monthly"} markedDates={marked} onDateChange={(date) => setSelectedDate(date)} />

        <ScrollView style={[styles.container, { flex: 1 }]}>
          {viewMode === "monthly" && filteredNotices.map((n) => (
            <NoticeCard key={n.id} title={n.materia} start={n.hora} description={n.descricao} date={brToISO(n.data)} local={n.local} matricula_do_responsavel={n.matricula} email_do_responsavel={n.email}/>
          ))}

          {viewMode === "weekly" && weeklyNotices.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20, color: "black" }}>
              Nenhuma aula de Monitoria/Nucleo marcada para essa semana.
            </Text>
          )}
          {viewMode === "weekly" && weeklyNotices.map((n) => (
            <NoticeCard key={n.id} title={n.materia} start={n.hora} description={n.descricao} date={brToISO(n.data)} local={n.local} matricula_do_responsavel={n.matricula} email_do_responsavel={n.email}/>
          ))}

          {viewMode === "daily" && dailyNotices.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20, color: "black" }}>
              Nenhuma aula de Monitoria/Nucleo marcada para hoje.
            </Text>
          )}
          {viewMode === "daily" && dailyNotices.length > 0 && dailyNotices.map((n) => (
            <NoticeCard key={n.id} title={n.materia} start={n.hora} description={n.descricao} date={brToISO(n.data)} local={n.local} matricula_do_responsavel={n.matricula} email_do_responsavel={n.email}/>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/screens/CreateNoticeScreen')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { marginHorizontal: 10 },
  title: { marginTop: 10, textAlign: "center", fontSize: 24, marginBottom: 20, color: "black" },
  floatingButton: { position: "absolute", bottom: 40, right: 20, backgroundColor: "#185545", borderRadius: 50, padding: 15, elevation: 5 },
});
