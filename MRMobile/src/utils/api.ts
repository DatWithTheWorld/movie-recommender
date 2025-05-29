
import axios from 'axios';
import { API_URL } from "@env";
import { Movie, WatchHistory, Comment, ChatbotResponse } from '../types';

console.log(API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const register = async (username: string, password: string, email: string) => {
  const response = await api.post('/register', { username, password, email });
  return response.data;
};

export const getMovies = async (search: string = '', genre: string = '', year?: number): Promise<Movie[]> => {
  const params: any = {};
  if (search) params.search = search;
  if (genre) params.genre = genre;
  if (year) params.year = year;
  const response = await api.get('/movies', { params });
  return response.data;
};

export const getMovie = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const uploadTrailer = async (movieId: number, file: any) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.assets[0].uri,
    type: file.assets[0].type,
    name: file.assets[0].fileName || 'trailer.mp4',
  } as any);
  const response = await api.post(`/trailers/${movieId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteTrailer = async (movieId: number) => {
  const response = await api.delete(`/trailers/${movieId}`);
  return response.data;
};

export const getFavorites = async (userId: number): Promise<Movie[]> => {
  const response = await api.get(`/favorites/${userId}`);
  return response.data;
};

export const addFavorite = async (userId: number, movieId: number) => {
  const response = await api.post('/favorites', { user_id: userId, movie_id: movieId });
  return response.data;
};

export const removeFavorite = async (userId: number, movieId: number) => {
  const response = await api.delete(`/favorites/${userId}/${movieId}`);
  return response.data;
};

export const getHistory = async (userId: number): Promise<WatchHistory[]> => {
  const response = await api.get(`/history/${userId}`);
  return response.data;
};

export const addHistory = async (userId: number, movieId: number) => {
  const response = await api.post('/history', { user_id: userId, movie_id: movieId });
  return response.data;
};

export const getComments = async (movieId: number): Promise<Comment[]> => {
  const response = await api.get(`/comments/${movieId}`);
  return response.data;
};

export const addComment = async (userId: number, movieId: number, content: string) => {
  const response = await api.post('/comments', { user_id: userId, movie_id: movieId, content });
  return response.data;
};

export const updateComment = async (id: number, content: string) => {
  const response = await api.put(`/comments/${id}`, { content });
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

export const chatWithAI = async (message: string, userId: number): Promise<ChatbotResponse> => {
  const response = await api.post('/ai-chat', { message, user_id: userId });
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};
