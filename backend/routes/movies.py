from flask import Blueprint, jsonify, request, current_app
from app import db
from models.movie import Movie
from recommender.recommender import get_trailer

bp = Blueprint('movies', __name__)

@bp.route('/movies', methods=['GET'])
def get_movies():
    search = request.args.get('search', '')
    genre = request.args.get('genre', '')
    year = request.args.get('year', type=int)
    
    query = Movie.query
    if search:
        query = query.filter(Movie.title.ilike(f'%{search}%') | Movie.description.ilike(f'%{search}%'))
    if genre:
        query = query.filter(Movie.genres.ilike(f'%{genre}%'))
    if year:
        query = query.filter(Movie.year == year)
    
    movies = query.all()
    return jsonify([{
        'id': m.id,
        'title': m.title,
        'genres': m.genres,
        'year': m.year,
        'description': m.description,
        'director': m.director,
        'actors': m.actors,
        'trailer_url': m.trailer_url,
        'trailer_local': m.trailer_local
    } for m in movies])

@bp.route('/movies/<int:id>', methods=['GET'])
def get_movie(id):
    movie = Movie.query.get_or_404(id)
    try:
        if not movie.trailer_local and not movie.trailer_url:
            current_app.logger.debug(f'Trying to get trailer for: {movie.title} ({movie.year})')
            trailer = get_trailer(movie.title, movie.year)
            current_app.logger.debug(f'Trailer result: {trailer}')
            movie.trailer_url = trailer
            db.session.commit()
    except Exception as e:
        current_app.logger.error(f'[ERROR]: Failed to get trailer for movie id {id} - {e}')
        return jsonify({'error': 'Failed to fetch trailer'}), 500

    return jsonify({
        'id': movie.id,
        'title': movie.title,
        'genres': movie.genres,
        'year': movie.year,
        'description': movie.description,
        'director': movie.director,
        'actors': movie.actors,
        'trailer_url': movie.trailer_url,
        'trailer_local': movie.trailer_local
    })