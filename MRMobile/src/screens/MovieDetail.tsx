import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, ScrollView, ActivityIndicator, Linking } from 'react-native'; 
import * as DocumentPicker from 'expo-document-picker';
import tw from 'twrnc';
import { getMovie, uploadTrailer, deleteTrailer, addFavorite, addHistory, getComments, addComment, updateComment, deleteComment } from '../utils/api';
import { Movie, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { API_URL } from '@env';
import { Video, ResizeMode } from 'expo-av';
import YoutubePlayer from "react-native-youtube-iframe";

type Props = {
  route: RouteProp<RootStackParamList, 'MovieDetail'>;
};

const MovieDetailScreen: React.FC<Props> = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
    
    fetchMovie();
    fetchComments();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const data = await getMovie(movieId);
      setMovie(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin phim');
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(movieId);
      setComments(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải bình luận');
    }
  };

  const handleUploadTrailer = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/mp4', 'video/webm'],
      });
      if (!result.canceled) {
        const response = await uploadTrailer(movieId, result);
        Alert.alert('Thành công', response.message);
        fetchMovie();
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.error || 'Tải trailer thất bại');
    }
  };

  const handleDeleteTrailer = async () => {
    try {
      const response = await deleteTrailer(movieId);
      Alert.alert('Thành công', response.message);
      fetchMovie();
    } catch (error) {
      Alert.alert('Lỗi', 'Xóa trailer thất bại');
    }
  };

  const handleAddFavorite = async () => {
    if (!user) return;
    try {
      console.log(user);
      
      await addFavorite(user.user_id, movieId);
      Alert.alert('Thành công', 'Đã thêm vào yêu thích');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm vào yêu thích');
    }
  };

  const handleAddHistory = async () => {
    if (!user) return;
    try {
      await addHistory(user.user_id, movieId);
      Alert.alert('Thành công', 'Đã thêm vào lịch sử xem');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm vào lịch sử xem');
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    try {
      await addComment(user.user_id, movieId, newComment.trim());
      setNewComment('');
      fetchComments();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm bình luận');
    }
  };

  const handleUpdateComment = async (id: number, content: string) => {
    try {
      await updateComment(id, content);
      fetchComments();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật bình luận');
    }
  };


const extractYouTubeId = (url: string | undefined): string => {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]+)/);
  return match ? match[1] : '';
};
  const handleDeleteComment = async (id: number) => {
    try {
      await deleteComment(id);
      fetchComments();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa bình luận');
    }
  };

  if (!movie) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-1`}>{movie.title}</Text>
      <Text style={tw`text-lg mb-2`}>{movie.genres} | {movie.year}</Text>
      <Text style={tw`mb-2`}>{movie.description}</Text>
      <Text style={tw`mb-1`}>🎬 Đạo diễn: {movie.director}</Text>
      <Text style={tw`mb-4`}>⭐ Diễn viên: {movie.actors}</Text>

      {/* Trailer */}
      {movie.trailer_local ? (
          <Video
            source={{ uri: `${API_URL}${movie.trailer_local}` }}
            style={tw`w-full h-56 mb-4 rounded`}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
          />
        ) : movie.trailer_url ? (
          <View style={tw`mb-4`}>
            <Text style={tw`text-base text-blue-500 mb-1`}>Trailer:</Text>
            <YoutubePlayer
              height={200}
              play={false}
              videoId={extractYouTubeId(movie.trailer_url)}
            />
          </View>
        ) : (
          <Text style={tw`text-gray-500 mb-4`}>Chưa có trailer</Text>
        )}

      <View style={tw`flex-row flex-wrap justify-between mb-4`}>
        <View style={tw`mb-2`}>
          <Button title="📤 Tải Trailer" onPress={handleUploadTrailer} />
        </View>
        <View style={tw`mb-2`}>
          <Button title="🗑️ Xóa Trailer" onPress={handleDeleteTrailer} />
        </View>
        <View style={tw`mb-2`}>
          <Button title="❤️ Thêm Yêu Thích" onPress={handleAddFavorite} />
        </View>
        <View style={tw`mb-2`}>
          <Button title="🕒 Thêm Lịch Sử" onPress={handleAddHistory} />
        </View>
      </View>

      {/* Comments */}
      <Text style={tw`text-xl font-bold mb-2`}>💬 Bình Luận</Text>
      <TextInput
        style={tw`border border-gray-300 p-2 mb-2 rounded`}
        placeholder="Viết bình luận..."
        value={newComment}
        onChangeText={setNewComment}
      />
      <Button title="Gửi Bình Luận" onPress={handleAddComment} />

      {comments.map((comment) => (
        <View key={comment.id} style={tw`p-2 border-b border-gray-200`}>
          <Text style={tw`font-bold`}>👤 User {comment.user_id}</Text>
          <Text>{comment.content}</Text>
          <Text style={tw`text-gray-500`}>
            {new Date(comment.created_at).toLocaleString()}
          </Text>
          {user?.user_id === comment.user_id && (
            <View style={tw`flex-row mt-2`}>
              <Button
                title="✏️ Sửa"
                onPress={() => {
                  const newContent = prompt('Sửa bình luận:', comment.content);
                  if (newContent) handleUpdateComment(comment.id, newContent);
                }}
              />
              <View style={tw`ml-2`}>
                <Button title="🗑️ Xóa" onPress={() => handleDeleteComment(comment.id)} />
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default MovieDetailScreen;
