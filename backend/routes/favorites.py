from flask import Blueprint, jsonify, request
from app import db
from models.favorite import Favorite

bp = Blueprint('favorites', __name__)

@bp.route('/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'movie_id': f.movie_id
    } for f in favorites])

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