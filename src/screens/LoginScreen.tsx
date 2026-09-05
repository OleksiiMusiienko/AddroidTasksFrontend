import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext.tsx';

interface Props {
  onRegister: () => void;
}

export const LoginScreen = ({ onRegister }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Помилка', 'Введіть логін та пароль');
      return;
    }

    try {
      setLoading(true);

      await login(username, password);
    } catch (error) {
      console.log('LOGIN ERROR:', error);

      Alert.alert('Помилка', 'Невірний логін або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Авторизація...' : 'Увійти'}
        </Text>
      </Pressable>

      <Pressable style={styles.registerButton} onPress={onRegister}>
        <Text style={styles.registerText}>Реєстрація</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#333',
  },

  buttonText: {
    fontSize: 16,
    color: '#fff',
  },

  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  registerText: {
    fontSize: 16,
  },
});
