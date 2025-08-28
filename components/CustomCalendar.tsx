import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useState } from "react";

interface CustomCalendarProps {
  onDateChange: (date: string) => void;
  visible?: boolean;
  markedDates: any;
}

export default function CustomCalendar({
  onDateChange,
  visible = true,
  markedDates,
}: CustomCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  if (!visible) return null;

  return (
    <View>
      <Calendar
        markingType="custom"
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: "#2196F3",
          },
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          onDateChange(day.dateString);
        }}
        theme={{
          todayTextColor: "#4A90E2",
        }}
      />
    </View>
  );
}
