import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { AuthContext } from '../context/AuthContext';

function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/favorites/${user.user_id}`)
        .then(response => {         
          setFavorites(response.data)
        }
      )
        .catch(error => console.error(error));
    }
  }, [user]);

  const handleRemoveFavorite = (movieId) => {
    axios.delete(`http://localhost:5000/favorites/${user.user_id}/${movieId}`)
      .then(() => {
        setFavorites(favorites.filter(f => f.id !== movieId));
      })
      .catch(error => console.error(error));
  };

  if (!user) {
    return <div className="text-gray-900 dark:text-white">Please log in to view favorites.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map(fav => (
          <div key={fav.movie_id} className="relative">
            <MovieCard ey={fav.movie_id}  movie={fav} />
            <button
              onClick={() => handleRemoveFavorite(fav.movie_id)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;