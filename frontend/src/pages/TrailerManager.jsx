    import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TrailerUpload from '../components/TrailerUpload';
import MovieCard from '../components/MovieCard';

function TrailerManager() {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      axios.get('http://localhost:5000/movies')
        .then(response => setMovies(response.data))
        .catch(error => console.error(error));
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div className="text-gray-900 dark:text-white">Access denied. Admins only.</div>;
  }

  const handleDeleteTrailer = async (movieId) => {
    try {
      await axios.delete(`http://localhost:5000/trailers/${movieId}`);
      setMovies(movies.map(m => m.id === movieId ? { ...m, trailer_local: null } : m));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Manage Trailers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="relative">
            <MovieCard movie={movie} />
            <TrailerUpload movieId={movie.id} />
            {movie.trailer_local && (
              <button
                onClick={() => handleDeleteTrailer(movie.id)}
                className="mt-2 bg-red-600 text-white p-2 rounded"
              >
                Delete Trailer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrailerManager;