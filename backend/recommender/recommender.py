from surprise import SVD, Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from googleapiclient.discovery import build
from config import Config
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Flatten, Concatenate, Dense

def collaborative_filtering(user_id, movies, ratings):
    reader = Reader(rating_scale=(0.5, 5.0))
    data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)
    trainset = data.build_full_trainset()
    algo = SVD()
    algo.fit(trainset)
    
    predictions = []
    for movie_id in movies['movieId']:
        pred = algo.predict(user_id, movie_id)
        predictions.append((movie_id, pred.est))
    
    return sorted(predictions, key=lambda x: x[1], reverse=True)[:10]

def content_based_filtering(movie_id, movies):
    tfidf = TfidfVectorizer(max_features=1000)
    tfidf_matrix = tfidf.fit_transform(movies['genres'] + ' ' + movies['description'])
    cosine_sim = cosine_similarity(tfidf_matrix)
    
    idx = movies.index[movies['movieId'] == movie_id].tolist()[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    return [movies.iloc[i[0]]['movieId'] for i in sim_scores[1:11]]

def neural_collaborative_filtering(user_id, movies, ratings):
    # Encode userId và movieId thành chỉ số liên tục
    user_encoder = LabelEncoder()
    movie_encoder = LabelEncoder()

    ratings['user'] = user_encoder.fit_transform(ratings['userId'])
    ratings['movie'] = movie_encoder.fit_transform(ratings['movieId'])

    n_users = ratings['user'].nunique()
    n_movies = ratings['movie'].nunique()

    # Tạo model
    user_input = Input(shape=(1,))
    movie_input = Input(shape=(1,))

    user_embedding = Embedding(n_users, 50)(user_input)
    movie_embedding = Embedding(n_movies, 50)(movie_input)

    user_flat = Flatten()(user_embedding)
    movie_flat = Flatten()(movie_embedding)

    concat = Concatenate()([user_flat, movie_flat])
    dense = Dense(128, activation='relu')(concat)
    output = Dense(1, activation='sigmoid')(dense)

    model = Model(inputs=[user_input, movie_input], outputs=output)
    model.compile(optimizer='adam', loss='mse')

    # Train
    user_ids = ratings['user'].values
    movie_ids = ratings['movie'].values
    ratings_scaled = ratings['rating'].values / 5.0

    model.fit([user_ids, movie_ids], ratings_scaled, epochs=10, batch_size=32, verbose=0)

    # Predict
    try:
        encoded_user_id = user_encoder.transform([user_id])[0]
    except:
        return []

    predictions = []
    for movie_id in movies['movieId']:
        try:
            encoded_movie_id = movie_encoder.transform([movie_id])[0]
            pred = model.predict([np.array([encoded_user_id]), np.array([encoded_movie_id])], verbose=0)[0][0]
            predictions.append((movie_id, pred * 5.0))  # scale back to 0–5
        except:
            continue

    return sorted(predictions, key=lambda x: x[1], reverse=True)[:10]


def hybrid_recommendations(user_id, movie_id, movies, ratings):
    collab_recs = collaborative_filtering(user_id, movies, ratings)
    content_recs = content_based_filtering(movie_id, movies) if movie_id else []
    neural_recs = neural_collaborative_filtering(user_id, movies, ratings)
    
    recs = {}
    for movie_id, score in collab_recs:
        recs[movie_id] = recs.get(movie_id, 0) + score * 0.4
    for movie_id in content_recs:
        recs[movie_id] = recs.get(movie_id, 0) + 0.3
    for movie_id, score in neural_recs:
        recs[movie_id] = recs.get(movie_id, 0) + score * 0.3
    
    return sorted(recs.items(), key=lambda x: x[1], reverse=True)[:10]

def get_trailer(title, year):
    youtube = build('youtube', 'v3', developerKey=Config.YOUTUBE_API_KEY)
    query = f"{title} {year} trailer"
    request = youtube.search().list(q=query, part='snippet', maxResults=1)
    response = request.execute()
    if response['items']:
        return f"https://www.youtube.com/watch?v={response['items'][0]['id']['videoId']}"
    return None