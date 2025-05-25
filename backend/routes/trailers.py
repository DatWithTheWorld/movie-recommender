from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from app import db
from models.movie import Movie
from config import Config
import os

bp = Blueprint('trailers', __name__)

ALLOWED_EXTENSIONS = {'mp4', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/trailers/<int:movie_id>', methods=['POST'])
def upload_trailer(movie_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        movie = Movie.query.get_or_404(movie_id)
        filename = secure_filename(f"{movie_id}_{file.filename}")
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)
        movie.trailer_local = f"/static/trailers/{filename}"
        db.session.commit()
        return jsonify({'message': 'Trailer uploaded', 'trailer_local': movie.trailer_local})
    return jsonify({'error': 'Invalid file type'}), 400

@bp.route('/trailers/<int:movie_id>', methods=['DELETE'])
def delete_trailer(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    if movie.trailer_local:
        file_path = os.path.join(Config.UPLOAD_FOLDER, movie.trailer_local.split('/')[-1])
        if os.path.exists(file_path):
            os.remove(file_path)
        movie.trailer_local = None
        db.session.commit()
    return jsonify({'message': 'Trailer deleted'})