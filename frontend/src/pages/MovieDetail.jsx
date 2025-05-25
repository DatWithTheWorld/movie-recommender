import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
import CommentSection from '../components/CommentSection';
import { AuthContext } from '../context/AuthContext';

function MovieDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/movies/${id}`)
      .then(response => setMovie(response.data))
      .catch(error => console.error(error));

    axios.get(`http://localhost:5000/recommendations/movie/${id}`)
      .then(response => setRecommendations(response.data))
      .catch(error => console.error(error));

    if (user) {
      axios.post('http://localhost:5000/history', { user_id: user.user_id, movie_id: id })
        .catch(error => console.error(error));
    }
  }, [id, user]);

  if (!movie) return <div className="text-gray-900 dark:text-white">Loading...</div>;

  const trailerSource = movie.trailer_local || movie.trailer_url;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{movie.title}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{movie.genres}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">Year: {movie.year}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">Director: {movie.director}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Actors: {movie.actors}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{movie.description}</p>
      {trailerSource && <VideoPlayer url={trailerSource} />}
      <CommentSection movieId={id} userId={user?.user_id} />
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Recommended Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map(rec => (
          <MovieCard key={rec.movie_id} movie={rec} />
        ))}
      </div>
    </div>
  );
}

export default MovieDetail;