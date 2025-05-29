
export interface Movie {
  id: number;
  title: string;
  genres: string;
  year: number;
  description: string;
  director: string;
  actors: string;
  trailer_url?: string;
  trailer_local?: string;
}

export interface WatchHistory {
  id: number;
  title: string;
  genres: string;
  year: number;
  description: string;
  director: string;
  actors: string;
  trailer_url?: string;
  trailer_local?: string;
  watched_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface ChatbotResponse {
  ai_response: string;
  type: 'movie_recommendation' | 'general' | 'error';
  recommended_movies?: string[];
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  MovieDetail: { movieId: number };
  Favorites: undefined;
  History: undefined;
  Chatbot: undefined;
  Analytics: undefined;
};
