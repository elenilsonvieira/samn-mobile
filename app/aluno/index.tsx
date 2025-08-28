import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { LocaleConfig } from "react-native-calendars";
import NoticeCard from "@/components/NoticeCard";
import ViewModeSelector from "@/components/ViewModeSelector";
import CustomCalendar from "@/components/CustomCalendar";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../components/src/fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
  tipo: "Monitoria" | "Nucleo";
  nome: string;
};

type StoredNotice = Omit<AvisoRegraPersistida, "untilISO" | "occurrences"> & {
  data: string;
  id: string;
};

export default function NoticeListScreen() {
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">(
    "monthly"
  );
  const [regras, setRegras] = useState<AvisoRegraPersistida[]>([]);
  const [notices, setNotices] = useState<StoredNotice[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<StoredNotice | null>(
    null
  );
  const currentUser = auth.currentUser;
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

  const expandirRecorrencias = useCallback(
    (regras: AvisoRegraPersistida[]): StoredNotice[] => {
      const avisosExpandidos: StoredNotice[] = [];
      regras.forEach((regra) => {
        try {
          const dataInicio = parseToDate(regra.data);
          const frequencia = regra.frequencia;
          const until = regra.untilISO ? new Date(regra.untilISO) : null;
          const maxOcorrencias = regra.occurrences ?? 20;

          if (frequencia === "Única") {
            avisosExpandidos.push({
              ...regra,
              data: formatBRDate(dataInicio),
              id: regra.id + "_0",
            });
            return;
          }

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
            if (frequencia === "Semanal")
              currentDate.setDate(currentDate.getDate() + 7);
            else if (frequencia === "Mensal")
              currentDate.setMonth(currentDate.getMonth() + 1);
            else if (frequencia === "Anual")
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

  useFocusEffect(
    useCallback(() => {
      const unsubscribeMonitoria = onSnapshot(
        collection(db, "aulas_monitoria"),
        (snapshot) => {
          const monitorias: AvisoRegraPersistida[] = snapshot.docs.map(
            (doc) => {
              const raw = doc.data();
              const dataHora: Date | null = raw.dataHora?.toDate
                ? raw.dataHora.toDate()
                : null;
              return {
                id: doc.id,
                materia: raw.materia,
                data: dataHora ? formatBRDate(dataHora) : "",
                hora: dataHora
                  ? `${String(dataHora.getHours()).padStart(2, "0")}:${String(
                      dataHora.getMinutes()
                    ).padStart(2, "0")}`
                  : "",
                descricao: raw.descricao || "",
                frequencia: raw.frequencia || "Única",
                createdAt: raw.criadoEm?.toDate
                  ? raw.criadoEm.toDate().toISOString()
                  : raw.criadoEm,
                local: raw.local || "",
                matricula: raw.Matricula || "",
                email: raw.Uid || "",
                tipo: "Monitoria",
                nome: raw.nome || "",
              };
            }
          ) as AvisoRegraPersistida[];

          setRegras((prev) => {
            const others = prev.filter((r) => r.tipo !== "Monitoria");
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
            const dataHora: Date | null = raw.dataHora?.toDate
              ? raw.dataHora.toDate()
              : null;
            return {
              id: doc.id,
              materia: raw.materia,
              data: dataHora ? formatBRDate(dataHora) : "",
              hora: dataHora
                ? `${String(dataHora.getHours()).padStart(2, "0")}:${String(
                    dataHora.getMinutes()
                  ).padStart(2, "0")}`
                : "",
              descricao: raw.descricao || "",
              frequencia: raw.frequencia || "Única",
              createdAt: raw.criadoEm?.toDate
                ? raw.criadoEm.toDate().toISOString()
                : raw.criadoEm,
              local: raw.local || "",
              matricula: raw.matricula || "",
              email: raw.uid || "",
              tipo: "Nucleo",
              nome: raw.nome || "",
            };
          }) as AvisoRegraPersistida[];

          setRegras((prev) => {
            const others = prev.filter((r) => r.tipo !== "Nucleo");
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

  const weeklyNotices = useMemo(
    () => notices.filter((n) => weekDates.includes(brToISO(n.data))),
    [notices, weekDates]
  );
  const dailyNotices = useMemo(
    () => notices.filter((n) => brToISO(n.data) === todayISO),
    [notices, todayISO]
  );

  const marked: { [date: string]: any } = {};

  for (const n of notices) {
    const iso = brToISO(n.data);

    if (!marked[iso]) marked[iso] = { marked: true, dotColor: "" };

    if (marked[iso].dotColor) {
      if (
        (marked[iso].dotColor === "#2196F3" && n.tipo === "Nucleo") ||
        (marked[iso].dotColor === "#FFD700" && n.tipo === "Monitoria")
      ) {
        marked[iso].dotColor = "#4CAF50";
      }
    } else {
      marked[iso].dotColor = n.tipo === "Monitoria" ? "#2196F3" : "#FFD700";
    }
  }

  if (selectedDate)
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: "#2196F3",
    };

  marked[todayISO] = {
    ...(marked[todayISO] || {}),
    customStyles: {
      container: { backgroundColor: "#80df85" },
      text: { color: "white", fontWeight: "bold" },
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
              <TouchableOpacity
                key={n.id}
                onPress={() => {
                  setSelectedNotice(n);
                  setModalVisible(true);
                }}
              >
                <NoticeCard
                  title={n.materia}
                  tipo={n.tipo}
                  start={n.hora}
                  description={n.descricao}
                  date={brToISO(n.data)}
                  local={n.local}
                  nome={n.nome}
                  matricula_do_responsavel={n.matricula}
                  email_do_responsavel={n.email}
                />
              </TouchableOpacity>
            ))}

          {viewMode === "weekly" && weeklyNotices.length === 0 && (
            <Text
              style={{ textAlign: "center", marginTop: 20, color: "black" }}
            >
              Nenhuma aula de Monitoria/Nucleo marcada para essa semana.
            </Text>
          )}
          {viewMode === "weekly" &&
            weeklyNotices.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => {
                  setSelectedNotice(n);
                  setModalVisible(true);
                }}
              >
                <NoticeCard
                  title={n.materia}
                  tipo={n.tipo}
                  start={n.hora}
                  description={n.descricao}
                  date={brToISO(n.data)}
                  local={n.local}
                  nome={n.nome}
                  matricula_do_responsavel={n.matricula}
                  email_do_responsavel={n.email}
                />
              </TouchableOpacity>
            ))}

          {viewMode === "daily" && dailyNotices.length === 0 && (
            <Text
              style={{ textAlign: "center", marginTop: 20, color: "black" }}
            >
              Nenhuma aula de Monitoria/Nucleo marcada para hoje.
            </Text>
          )}
          {viewMode === "daily" &&
            dailyNotices.length > 0 &&
            dailyNotices.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => {
                  setSelectedNotice(n);
                  setModalVisible(true);
                }}
              >
                <NoticeCard
                  title={n.materia}
                  tipo={n.tipo}
                  start={n.hora}
                  description={n.descricao}
                  date={brToISO(n.data)}
                  local={n.local}
                  nome={n.nome}
                  matricula_do_responsavel={n.matricula}
                  email_do_responsavel={n.email}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
            }}
          >
            {selectedNotice && (
              <>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Aula de {selectedNotice.materia}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  {selectedNotice.tipo}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Inicio: {selectedNotice.hora}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Descrição: {selectedNotice.descricao}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Data: {selectedNotice.data}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Local: {selectedNotice.local}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Matricula do Responsável: {selectedNotice.matricula}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Nome do Responsável: {selectedNotice.nome}
                </Text>
                <Text style={{ fontSize: 13, padding: 5 }}>
                  Email do Responsável: {selectedNotice.email}
                </Text>
                <TouchableOpacity
                  style={{ marginTop: 20, alignSelf: "center" , backgroundColor: "#377739", padding: 10, borderRadius: 5}}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "white" }}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { marginHorizontal: 10 },
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
