import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { AuthContext } from '../context/AuthContext';

function WatchHistory() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/history/${user.user_id}`)
        .then(response => setHistory(response.data))
        .catch(error => console.error(error));
    }
  }, [user]);

  if (!user) {
    return <div className="text-gray-900 dark:text-white">Please log in to view watch history.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Watch History</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {history.map(item => (
          <MovieCard key={item.movie_id} movie={item} />
        ))}
      </div>
    </div>
  );
}

export default WatchHistory;