import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { role } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iskool</Text>
      <Text style={styles.subtitle}>Active role: {role}</Text>
      <Button title="Switch Role" onPress={() => navigation.navigate('RoleSwitcher')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 16,
  },
});
