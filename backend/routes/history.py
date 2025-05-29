from flask import Blueprint, jsonify, request
from app import db
from models.watch_history import WatchHistory
from models.movie import Movie

bp = Blueprint('history', __name__)

@bp.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    history = WatchHistory.query.filter_by(user_id=user_id).all()
    result = []

    for h in history:
        movie = Movie.query.get(h.movie_id)
        if movie:
            result.append({
                'id': movie.id,
                'title': movie.title,
                'genres': movie.genres,
                'year': movie.year,
                'description': movie.description,
                'trailer_url': movie.trailer_url,
                'trailer_local': movie.trailer_local,
                'director': movie.director,
                'actors': movie.actors,
                'watched_at': h.watched_at.isoformat()
            })

    return jsonify(result)

@bp.route('/history', methods=['POST'])
def add_history():
    data = request.json
    history = WatchHistory(
        user_id=data['user_id'],
        movie_id=data['movie_id']
    )
    db.session.add(history)
    db.session.commit()
    return jsonify({'message': 'Watch history added'})