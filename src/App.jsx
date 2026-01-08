import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    
    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLoginSuccess = (token, username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard username={username} onLogout={handleLogout} />;
}

export default App;