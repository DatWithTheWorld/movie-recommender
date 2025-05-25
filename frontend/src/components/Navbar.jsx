import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 dark:bg-dark-card p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Movie Recommender</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-white hover:text-blue-200">Home</Link>
          <Link to="/movies" className="text-white hover:text-blue-200">Movies</Link>
          <Link to="/recommendations" className="text-white hover:text-blue-200">Recommendations</Link>
          <Link to="/favorites" className="text-white hover:text-blue-200">Favorites</Link>
          <Link to="/history" className="text-white hover:text-blue-200">Watch History</Link>
          <Link to="/analytics" className="text-white hover:text-blue-200">Analytics</Link>
          {user && user.role === 'admin' && (
            <Link to="/trailers" className="text-white hover:text-blue-200">Manage Trailers</Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="text-white hover:text-blue-200">Profile</Link>
              <button onClick={logout} className="text-white hover:text-blue-200">Logout</button>
            </>
          ) : (
            <Link to="/profile" className="text-white hover:text-blue-200">Login</Link>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-white hover:text-blue-200"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;