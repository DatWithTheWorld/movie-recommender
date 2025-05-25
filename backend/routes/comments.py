from flask import Blueprint, jsonify, request
from app import db
from models.comment import Comment

bp = Blueprint('comments', __name__)

@bp.route('/comments/<int:movie_id>', methods=['GET'])
def get_comments(movie_id):
    comments = Comment.query.filter_by(movie_id=movie_id).all()
    return jsonify([{
        'id': c.id,
        'user_id': c.user_id,
        'content': c.content,
        'created_at': c.created_at.isoformat()
    } for c in comments])

@bp.route('/comments', methods=['POST'])
def add_comment():
    data = request.json
    comment = Comment(
        user_id=data['user_id'],
        movie_id=data['movie_id'],
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added'})

@bp.route('/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = Comment.query.get_or_404(id)
    data = request.json
    comment.content = data['content']
    db.session.commit()
    return jsonify({'message': 'Comment updated'})

@bp.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get_or_404(id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted'})