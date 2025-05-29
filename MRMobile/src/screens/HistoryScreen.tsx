
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { getHistory } from '../utils/api';
import { WatchHistory } from '../types';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [history, setHistory] = useState<WatchHistory[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const data = await getHistory(user!.user_id);
      setHistory(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử xem');
    }
  };

  const renderHistory = ({ item }: { item: WatchHistory }) => (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-200`}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <Text style={tw`text-lg font-bold`}>{item.title}</Text>
      <Text>{item.genres} | {item.year}</Text>
      <Text numberOfLines={2}>{item.description}</Text>
      <Text style={tw`text-gray-500`}>Xem lúc: {new Date(item.watched_at).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Lịch Sử Xem</Text>
      <FlatList
        data={history}
        renderItem={renderHistory}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default HistoryScreen;
