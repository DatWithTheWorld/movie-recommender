import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Chart({ data, title }) {
  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
}

export default Chart;