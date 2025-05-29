
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import tw from 'twrnc';
import { register } from '../utils/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !email) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      await register(username, password, email);
      Alert.alert('Thành công', 'Đăng ký thành công', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      console.error('Register error:', error.response || error);
      Alert.alert('Lỗi', error.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-4`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Đăng Ký</Text>
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
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Đăng Ký" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
