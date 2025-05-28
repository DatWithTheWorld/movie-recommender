from flask import Blueprint, jsonify
from app import db
from models.movie import Movie
import pandas as pd
from recommender.recommender import hybrid_recommendations

bp = Blueprint('recommendations', __name__)

def load_data_from_db():
    print("Loading data from database...")
    movies = pd.read_sql('SELECT * FROM movie', db.engine)
    return movies

@bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    movies = load_data_from_db()
    recs = hybrid_recommendations(user_id, None, movies)
    rec_movies = []
    for movie_id, score in recs[:10]:
        movie = db.session.query(Movie).filter_by(id=int(movie_id)).first()
        if movie:
            rec_movies.append({
                'movie_id': movie_id,
                'title': movie.title,
                'genres': movie.genres,
                'score': score
            })
    return jsonify(rec_movies)

@bp.route('/recommendations/movie/<int:movie_id>', methods=['GET'])
def get_movie_recommendations(movie_id):
    movies = load_data_from_db()
    print("Movie ID requested:", movie_id)
    print("DataFrame columns:", movies.columns)
    
    recs = hybrid_recommendations(1, movie_id, movies)
    print("Recommendations returned:", recs)
    
    rec_movies = []
    for movie_id, score in recs[:10]:
        movie = db.session.query(Movie).filter_by(id=movie_id).first()
        if movie:
            rec_movies.append({
                'movie_id': movie_id,
                'title': movie.title,
                'genres': movie.genres,
                'score': score
            })
    return jsonify(rec_movies)

@bp.route('/recommendations/genre/<genre>', methods=['GET'])
def get_genre_recommendations(genre):
    movies = load_data_from_db()
    genre_movies = movies[movies['genres'].str.contains(genre, case=False, na=False)]
    if genre_movies.empty:
        return jsonify([])
    recs = hybrid_recommendations(1, genre_movies['id'].iloc[0], movies)
    rec_movies = []
    for movie_id, score in recs[:10]:
        movie = db.session.query(Movie).filter_by(id=movie_id).first()
        if movie:
            rec_movies.append({
                'movie_id': movie_id,
                'title': movie.title,
                'genres': movie.genres,
                'score': score
            })
    return jsonify(rec_movies)