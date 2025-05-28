import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.feature_extraction.text import TfidfVectorizer


def load_movielens_data():
    movies = pd.read_csv('data/movielens/movies.csv')
    ratings = pd.read_csv('data/movielens/ratings.csv')
    tags = pd.read_csv('data/movielens/tags.csv')
    return movies, ratings, tags

def preprocess_data():
    
    from app import app, db  # ← Import app ở đây
    from models.movie import Movie
    movies, ratings, tags = load_movielens_data()

    movies = movies.drop_duplicates(subset=['title'])
    movies['genres'] = movies['genres'].fillna('Unknown')

    ratings_count = ratings.groupby('movieId').size().reset_index(name='rating_count')
    movies = movies.merge(ratings_count, on='movieId', how='left')
    movies['popularity'] = pd.qcut(movies['rating_count'], 4, labels=['Low', 'Medium-Low', 'Medium', 'High'], duplicates='drop')

    movie_tags = tags.groupby('movieId')['tag'].apply(lambda x: ' '.join(x.dropna().astype(str))).reset_index()
    movies = movies.merge(movie_tags, on='movieId', how='left')
    movies['description'] = movies['tag'].fillna('')

    movies['year'] = movies['title'].str.extract(r'\((\d{4})\)').astype('Int64')

    tfidf = TfidfVectorizer(max_features=1000)
    genres_matrix = tfidf.fit_transform(movies['genres'] + ' ' + movies['description'])

    pca = PCA(n_components=10)
    genres_reduced = pca.fit_transform(genres_matrix.toarray())

    tsne = TSNE(n_components=2, learning_rate='auto', init='pca')
    genres_tsne = tsne.fit_transform(genres_matrix.toarray())

    # Bọc toàn bộ thao tác DB trong application context
    with app.app_context():
        for row in movies.to_dict(orient='records'):
            movie = Movie(
                id=row['movieId'],
                title=row['title'],
                genres=row['genres'],
                year=row['year'],
                description=row['description'],
                director='Unknown',
                actors='Unknown'
            )
            db.session.add(movie)
        db.session.commit()

    return movies, ratings, genres_reduced, genres_tsne
