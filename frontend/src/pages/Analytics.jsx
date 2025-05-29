import { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from '../components/Chart';

function Analytics() {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/analytics')
      .then(response => setAnalytics(response.data))
      .catch(error => console.error(error));
  }, []);

  const genreData = {
    labels: ['Genre 1', 'Genre 2', 'Genre 3'], // Giả định
    datasets: [{
      label: 'Genre Distribution',
      data: [100, 200, 150], // Giả định
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.genre_distribution && (
         <img  src={`http://localhost:5000${analytics.genre_distribution}`} alt="Rating Distribution" className="w-full" />
        )}
        {analytics.rating_distribution && (
          <img  src={`http://localhost:5000${analytics.rating_distribution}`} alt="Rating Distribution" className="w-full" />
        )}
        {analytics.correlation_matrix && (
          <img src={`http://localhost:5000${analytics.correlation_matrix}`} alt="Correlation Matrix" className="w-full" />
        )}
      </div>
    </div>
  );
}

export default Analytics;