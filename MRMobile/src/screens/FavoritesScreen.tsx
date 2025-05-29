
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import tw from 'twrnc';
import { getFavorites, removeFavorite } from '../utils/api';
import { Movie } from '../types';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Favorites'>;
};

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites(user!.user_id);
      setFavorites(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách yêu thích');
    }
  };

  const handleRemoveFavorite = async (movieId: number) => {
    if (!user) return;
    try {
      await removeFavorite(user.user_id, movieId);
      fetchFavorites();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa khỏi yêu thích');
    }
  };

  const renderFavorite = ({ item }: { item: Movie }) => (
    <View style={tw`p-4 border-b border-gray-200`}>
      <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
        <Text style={tw`text-lg font-bold`}>{item.title}</Text>
        <Text>{item.genres} | {item.year}</Text>
        <Text numberOfLines={2}>{item.description}</Text>
      </TouchableOpacity>
      <Button title="Xóa" onPress={() => handleRemoveFavorite(item.id)} />
    </View>
  );

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Phim Yêu Thích</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default FavoritesScreen;
