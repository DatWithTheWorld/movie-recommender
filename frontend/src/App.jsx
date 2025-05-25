import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Comments from './pages/Comments';
import Favorites from './pages/Favorites';
import WatchHistory from './pages/WatchHistory';
import Analytics from './pages/Analytics';
import TrailerManager from './pages/TrailerManager';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/comments/:movie_id" element={<Comments />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/history" element={<WatchHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/trailers" element={<TrailerManager />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;