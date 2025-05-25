from flask import Blueprint, jsonify, request
from app import db
from models.watch_history import WatchHistory

bp = Blueprint('history', __name__)

@bp.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    history = WatchHistory.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'movie_id': h.movie_id,
        'watched_at': h.watched_at.isoformat()
    } for h in history])

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