import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { AuthContext } from '../context/AuthContext';

function Recommendations() {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/recommendations/${user.user_id}`)
        .then(response => setRecommendations(response.data))
        .catch(error => console.error(error));
    }
  }, [user]);

  if (!user) {
    return <div className="text-gray-900 dark:text-white">Please log in to view recommendations.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your Recommendations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map(rec => (
          <MovieCard key={rec.movie_id} movie={rec} />
        ))}
      </div>
    </div>
  );
}

export default Recommendations;