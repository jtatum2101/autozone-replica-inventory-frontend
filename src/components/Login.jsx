import { useState } from 'react';
import axios from 'axios';


function Login({ onLoginSuccess }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            onLoginSuccess(response.data.token, response.data.username);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">AutoZone</h1>
            <p className="text-gray-600 mt-2">Inventory Management System</p>
          </div>
  
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Enter username"
                required
              />
            </div>
  
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Enter password"
                required
              />
            </div>
  
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
  
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
  
          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Admin:</span> admin / admin123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Manager:</span> manager / manager123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Employee:</span> employee / employee123
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;