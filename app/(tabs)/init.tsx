import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

export default function InitializerScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/main.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  image:{
    width: '80%',
    height: '50%', 
  }
});
