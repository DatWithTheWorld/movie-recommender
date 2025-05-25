import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

function MovieList() {
  const [movies, setMovies] = useState([]);

  const handleSearch = ({ search, genre, year }) => {
    axios.get('http://localhost:5000/movies', { params: { search, genre, year } })
      .then(response => setMovies(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    axios.get('http://localhost:5000/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">All Movies</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieList;