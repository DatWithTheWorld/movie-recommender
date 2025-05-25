import { useState } from 'react';
import axios from 'axios';

function TrailerUpload({ movieId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`http://localhost:5000/trailers/${movieId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-card rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Trailer for Movie ID: {movieId}</h3>
      <input
        type="file"
        accept=".mp4,.webm"
        onChange={handleFileChange}
        className="mt-2"
      />
      <button
        onClick={handleUpload}
        className="mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-gray-900 dark:text-white">{message}</p>}
    </div>
  );
}

export default TrailerUpload;