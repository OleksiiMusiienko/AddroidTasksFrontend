import { useState } from 'react';
import { register } from '../api/tasksApi.ts';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

interface Props {
  onLogin: () => void;
  
}

export const RegisterScreen = ({onLogin}: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      return;
    }
    try {
      setLoading(true);
      await register(username, password);
      Alert.alert('Successfully registered!',
        'User registered', [
          {
            text: 'Login',
            onPress: () => onLogin(),
          }
        ]);
    } catch{

    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      <Text>Register</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize={'none'}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Pressable onPress={handleRegister} disabled={loading}>
        <Text>{loading ? 'Registration...' : 'Register'}</Text>
      </Pressable>
      <Pressable onPress={onLogin}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}