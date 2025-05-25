import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{movie.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{movie.genres}</p>
      <p className="text-gray-600 dark:text-gray-300">{movie.year}</p>
      <p className="text-gray-600 dark:text-gray-300 truncate">{movie.description}</p>
      <Link to={`/movies/${movie.id}`} className="text-blue-600 hover:underline dark:text-blue-400">View Details</Link>
    </div>
  );
}

export default MovieCard;