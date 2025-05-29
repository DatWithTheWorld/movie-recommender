from flask import Blueprint, jsonify
from recommender.preprocess import load_movielens_data
from recommender.plots import plot_genre_distribution, plot_rating_distribution, plot_correlation_matrix

bp = Blueprint('analytics', __name__)

@bp.route('/analytics', methods=['GET'])
def get_analytics():
    movies, ratings, _= load_movielens_data()
    plot_genre_distribution(movies)
    plot_rating_distribution(ratings)
    plot_correlation_matrix(movies, ratings)
    return jsonify({
        'genre_distribution': '/static/plots/genre_distribution.png',
        'rating_distribution': '/static/plots/rating_distribution.png',
        'correlation_matrix': '/static/plots/correlation_matrix.png'
    })