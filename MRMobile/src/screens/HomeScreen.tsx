import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { getMovies } from '../utils/api';
import { Movie } from '../types';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Menu, Provider, Button } from 'react-native-paper';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [search, genre, year]);

  const fetchMovies = async () => {
    try {
      const data = await getMovies(search, genre, year ? parseInt(year) : undefined);
      setMovies(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách phim');
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-200`}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <Text style={tw`text-lg font-bold`}>{item.title}</Text>
      <Text>{item.genres} | {item.year}</Text>
      <Text numberOfLines={2}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Provider>
      <View style={tw`flex-1 p-4`}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={tw`mb-4`}
            >
              Menu
            </Button>
          }
        >
          <Menu.Item onPress={() => navigation.navigate('Favorites')} title="Yêu Thích" />
          <Menu.Item onPress={() => navigation.navigate('History')} title="Lịch Sử" />
          <Menu.Item onPress={() => navigation.navigate('Chatbot')} title="Chatbot" />
          <Menu.Item onPress={() => navigation.navigate('Analytics')} title="Phân Tích" />
          <Menu.Item onPress={logout} title="Đăng Xuất" />
        </Menu>

        <TextInput
          style={tw`border border-gray-300 p-2 mb-2 rounded`}
          placeholder="Tìm kiếm phim..."
          value={search}
          onChangeText={setSearch}
        />
        <TextInput
          style={tw`border border-gray-300 p-2 mb-2 rounded`}
          placeholder="Thể loại (ví dụ: Hành động)"
          value={genre}
          onChangeText={setGenre}
        />
        <TextInput
          style={tw`border border-gray-300 p-2 mb-2 rounded`}
          placeholder="Năm (ví dụ: 2020)"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </Provider>
  );
};

export default HomeScreen;
