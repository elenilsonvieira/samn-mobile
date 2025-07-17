import { View, Text, StyleSheet } from 'react-native';

interface NoticeCardProps {
  title: string;
  start: string;
  monitor: string;
  description: string;
  date?: string; // opcional
}

export default function NoticeCard({
  title,
  start,
  monitor,
  description,
  date,
}: NoticeCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {title} {date ? `(${date})` : ''}
      </Text>
      <View style={styles.row}>
        <Text style={styles.text}>Início: {start}</Text>
        <Text style={styles.text}>Monitor: {monitor}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    marginTop: 6,
  },
});
