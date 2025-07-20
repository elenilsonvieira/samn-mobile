import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ViewModeSelectorProps {
  selected: string;
  onChange: (mode: string) => void;
}

const modes = ['Hoje', 'Semanal', 'Mensal'];

export default function ViewModeSelector({ selected, onChange }: ViewModeSelectorProps) {
  return (
    <View style={styles.mainContainer}>
      {modes.map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.button,
            selected === mode && styles.selectedButton,
          ]}
          onPress={() => onChange(mode)}
        >
          <Text
            style={[
              styles.text,
              selected === mode && styles.selectedText,
            ]}
          >
            {mode}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#185545',
  },
  text: {
    color: '#4d4d4d',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});
