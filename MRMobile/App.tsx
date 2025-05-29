import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import tw from 'twrnc';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import { RootStackParamList } from './src/types';
import MovieDetailScreen from './src/screens/MovieDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Có thể kiểm tra token với backend nếu cần
        }
      } catch (error) {
        console.error('Lỗi kiểm tra token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng Ký' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gợi Ý Phim' }} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Chi Tiết Phim' }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Yêu Thích' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Lịch Sử Xem' }} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Chatbot AI' }} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Phân Tích' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;