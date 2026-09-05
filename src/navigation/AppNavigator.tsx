import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { useAuth } from '../context/AuthContext.tsx';

import TasksScreen from '../screens/TasksScreen.tsx';
import { RegisterScreen } from '../screens/RegisterScreen.tsx';
import { LoginScreen } from '../screens/LoginScreen.tsx';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { accessToken, isTokenLoading } = useAuth();

  const [showRegister, setShowRegister] = useState(false);

  if (isTokenLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {accessToken ? (
        <Stack.Screen name="Tasks" component={TasksScreen} />
      ) : showRegister ? (
        <Stack.Screen name="Register">
          {() => <RegisterScreen onLogin={() => setShowRegister(false)} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Login">
          {() => <LoginScreen onRegister={() => setShowRegister(true)} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
