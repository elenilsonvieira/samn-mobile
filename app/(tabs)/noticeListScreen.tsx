import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Header from "@/components/Header";
import { LocaleConfig } from 'react-native-calendars';
import NoticeCard from "@/components/NoticeCard";
import ViewModeSelector from "@/components/ViewModeSelector";
import CustomCalendar from "@/components/CustomCalendar";

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt-br';

export default function NoticeListScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const notices = [
    {
      title: "Monitoria de Algoritmos",
      date: "2025-08-11",
      start: "8:00",
      monitor: "Rafael",
      description: "Revisão e conceitos iniciais de programação.",
    },
    {
      title: "Revisão de HTML",
      date: "2025-07-14",
      start: "15:00",
      monitor: "Davi",
      description: "Revisão para avaliação prática do dia 21 de julho.",
    },
    {
      title: "Monitoria de Matemática",
      date: "2025-07-14",
      start: "15:00",
      monitor: "Rafael",
      description: "Foco em limites laterais.",
    },
    {
      title: "Aula de Reforço de Programação",
      date: '2025-07-18',
      start: '13:00',
      monitor: "Vinicius",
      description: "Para aqueles com problemas nos conceitos básicos"
    },
    {
      title: "Aula de Reforço de Linguagem de Marcação",
      date: '2025-07-18',
      start: '15:00',
      monitor: "Rafael",
      description: "Para aqueles com problemas nos conceitos básicos"
    },
    {
      title: "Aula de Reforço de Linguagem de Marcação",
      date: '2025-07-17',
      start: '15:00',
      monitor: "Rafael",
      description: "Para aqueles com problemas nos conceitos básicos"
    },
    {
      title: "Aula de Reforço de Linguagem de Marcação",
      date: '2025-07-19',
      start: '15:00',
      monitor: "Rafael",
      description: "Para aqueles com problemas nos conceitos básicos"
    },
    {
      title: "Aniversario Do Davi",
      date: '2025-07-30',
      start: '00:00',
      monitor: "Davi",
      description: "Parabéns!"
    },
  ];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filteredNotices = selectedDate
    ? notices.filter((n) => n.date === selectedDate)
    : [];
  const weekDates = React.useMemo(() => getCurrentWeekDates(), []);

  const weeklyNotices = notices.filter((n) => weekDates.includes(n.date));

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

  notices.forEach((n) => {
    marked[n.date] = {
      marked: true,
      dotColor: "blue",
    };
  });


  if (selectedDate) {
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: "#2196F3",
    };
  }

  marked[today] = {
  ...(marked[today] || {}),
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

  function getCurrentWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - dayOfWeek + i);
      const dateString = d.toISOString().slice(0, 10);
      week.push(dateString);
    }

    return week;
  }

  const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

  const todayD = getTodayString();
  const dailyNotices = notices.filter((notice) => {
    return notice.date === todayD;
  });


  return (
    <View style={styles.mainContainer}>
      <Header />
      <View style={styles.container}>
        <ViewModeSelector
          selected={
            viewMode === 'daily'
              ? 'Hoje'
              : viewMode === 'weekly'
              ? 'Semanal'
              : 'Mensal'
          }
          onChange={(mode) => {
            if (mode === 'Hoje') {
              setViewMode('daily');
            } else if (mode === 'Semanal') {
              setViewMode('weekly');
            } else {
              setViewMode('monthly');
            }
          }}
        />
        <CustomCalendar
          visible={viewMode === 'monthly'}
          markedDates={marked}
          onDateChange={(date) => setSelectedDate(date)}
        />

        <ScrollView>
          {viewMode === 'monthly' && filteredNotices.map((notice, index) => (
            <NoticeCard
              key={index}
              title={notice.title}
              start={notice.start}
              monitor={notice.monitor}
              description={notice.description}
            />
          ))}
          {viewMode === 'weekly' && weeklyNotices.map((notice, index) => (
            <NoticeCard
              key={index}
              title={notice.title}
              start={notice.start}
              monitor={notice.monitor}
              description={notice.description}
              date={notice.date}
            />
          ))}
          {viewMode === 'daily' && dailyNotices.length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20 , color:'white'}}>Nenhum aviso para hoje.</Text>
          )}
          {viewMode === 'daily' && dailyNotices.length > 0 && dailyNotices.map((notice, index) => (
            <NoticeCard
              key={index}
              title={notice.title}
              start={notice.start}
              monitor={notice.monitor}
              description={notice.description}
              date={notice.date}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container:{
    marginHorizontal: 10,
  },
  title: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
    color: "black",
  },
  noticeContainer: {
    marginBottom: 20,
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    elevation: 3,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#333",
  },
  noticeText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 4,
  },
  noticeDescription: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
