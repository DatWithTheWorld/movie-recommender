import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, login, logout } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { username, password, email });
      setMessage('Registration successful');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      await login(username, password);
      setMessage('Login successful');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h1>
      {user ? (
        <div>
          <p className="text-gray-900 dark:text-white">Welcome, {user.username} ({user.role})</p>
          <button
            onClick={logout}
            className="mt-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Register</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded dark:bg-dark-card dark:text-white w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded dark:bg-dark-card dark:text-white w-full mt-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded dark:bg-dark-card dark:text-white w-full mt-2"
            />
            <button
              onClick={handleRegister}
              className="mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded dark:bg-dark-card dark:text-white w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded dark:bg-dark-card dark:text-white w-full mt-2"
            />
            <button
              onClick={handleLogin}
              className="mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          {message && <p className="text-gray-900 dark:text-white">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default Profile;