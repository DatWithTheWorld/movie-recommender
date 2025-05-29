from flask import Blueprint, jsonify, request
from app import db
from models.favorite import Favorite
from models.movie import Movie

bp = Blueprint('favorites', __name__)

@bp.route('/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    favorite_movies = []
    for f in favorites:
        movie = Movie.query.get(f.movie_id)
        if movie:
            favorite_movies.append({
                'id': movie.id,
                'title': movie.title,
                'genres': movie.genres,
                'year': movie.year,
                'description': movie.description,
                'trailer_url': movie.trailer_url,
                'trailer_local': movie.trailer_local,
                'director': movie.director,
                'actors': movie.actors
            })
    return jsonify(favorite_movies)

@bp.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.json
    favorite = Favorite(
        user_id=data['user_id'],
        movie_id=data['movie_id']
    )
    db.session.add(favorite)
    db.session.commit()
    return jsonify({'message': 'Movie added to favorites'})

@bp.route('/favorites/<int:user_id>/<int:movie_id>', methods=['DELETE'])
def remove_favorite(user_id, movie_id):
    favorite = Favorite.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
    return jsonify({'message': 'Movie removed from favorites'})