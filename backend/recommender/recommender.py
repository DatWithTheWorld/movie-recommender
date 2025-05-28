from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from googleapiclient.discovery import build
from config import Config

def content_based_filtering(movie_id, movies):
    if movie_id is None:
        return []
    
    print("Running content-based filtering...")
    # Kết hợp genres và description để tạo nội dung cho content-based filtering
    movies['content'] = movies['genres'].fillna('') + ' ' + movies['description'].fillna('')
    tfidf = TfidfVectorizer(max_features=1000)
    tfidf_matrix = tfidf.fit_transform(movies['content'])
    cosine_sim = cosine_similarity(tfidf_matrix)
    
    # Tìm chỉ số của movie_id trong DataFrame
    idx = movies.index[movies['id'] == movie_id].tolist()
    if not idx:
        print(f"Movie ID {movie_id} not found, returning empty recommendations.")
        return []
    
    idx = idx[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    return [(movies.iloc[i[0]]['id'], i[1]) for i in sim_scores[1:10] if i[1] > 0]

def hybrid_recommendations(user_id, movie_id, movies, ratings=None):
    print(f"Running recommendations for user_id={user_id}, movie_id={movie_id}")

    # Nếu có movie_id, dùng content-based filtering
    if movie_id:
        content_recs = content_based_filtering(movie_id, movies)
        return content_recs

    # Nếu không có movie_id, trả về phim phổ biến
    print("No movie_id provided, falling back to popularity-based recommendations.")
    popular_movies = movies.sort_values(by='id', ascending=True)  # Fallback nếu không có popularity
    if 'popularity' in movies.columns:
        popular_movies = movies.sort_values(by='popularity', ascending=False, na_position='last')
    recs = [(row['id'], 1.0) for _, row in popular_movies.head(10).iterrows()]
    return recs[:10]

def get_trailer(title, year):
    try:
        youtube = build('youtube', 'v3', developerKey=Config.YOUTUBE_API_KEY)
        query = f"{title} {year} trailer"
        request = youtube.search().list(q=query, part='snippet', maxResults=1)
        response = request.execute()
        if response['items']:
            return f"https://www.youtube.com/watch?v={response['items'][0]['id']['videoId']}"
    except Exception as e:
        print(f"Error fetching trailer: {str(e)}")
    return None