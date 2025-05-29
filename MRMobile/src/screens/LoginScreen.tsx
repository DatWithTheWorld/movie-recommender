
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../context/AuthContext';
import { login } from '../utils/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên người dùng và mật khẩu');
      return;
    }
    try {
      const data = await login(username, password);
      await authLogin(data);
      navigation.replace('Home');
    } catch (error: any) {
      console.error('Login error:', error.response || error);
      Alert.alert('Lỗi', error.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-4`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Đăng Nhập</Text>
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded`}
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded`}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng Nhập" onPress={handleLogin} />
      <Button title="Đăng Ký" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;
