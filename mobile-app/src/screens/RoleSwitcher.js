import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher({ navigation }) {
  const { setRole } = useAuth();

  const selectRole = (newRole) => {
    setRole(newRole);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>
      <Button title="Parent" onPress={() => selectRole('PARENT')} />
      <View style={styles.spacer} />
      <Button title="Faculty" onPress={() => selectRole('FACULTY')} />
      <View style={styles.spacer} />
      <Button title="Principal / HOD" onPress={() => selectRole('PRINCIPAL')} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  spacer: {
    height: 12,
  },
});
