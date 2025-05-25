from flask import Blueprint, jsonify
from recommender.preprocess import load_movielens_data
from recommender.recommender import hybrid_recommendations

bp = Blueprint('recommendations', __name__)

@bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    movies, ratings, _ = load_movielens_data()
    recs = hybrid_recommendations(user_id, None, movies, ratings)
    return jsonify([{
        'movie_id': movie_id,
        'score': score
    } for movie_id, score in recs])

@bp.route('/recommendations/movie/<int:movie_id>', methods=['GET'])
def get_movie_recommendations(movie_id):
    movies, ratings, _= load_movielens_data()
    recs = hybrid_recommendations(1, movie_id, movies, ratings)  # user_id mặc định
    return jsonify([{
        'movie_id': movie_id,
        'score': score
    } for movie_id, score in recs])