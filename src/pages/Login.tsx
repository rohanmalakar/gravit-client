import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/Container';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Get the stored user data after successful login
      const storedUser = localStorage.getItem('auth_user');
      const userData = storedUser ? JSON.parse(storedUser) : null;
      
      // Determine redirect based on user role
      let redirectPath = from;
      if (!redirectPath) {
        redirectPath = userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      }
      
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 pt-20 px-4 sm:px-6 lg:px-8">
      <Container>
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Sign in to your account to continue
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center w-full sm:w-auto">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-900 border-gray-600 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm w-full sm:w-auto">
                  <a href="#" className="font-medium text-purple-400 hover:text-purple-300 transition-colors block sm:inline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">New to our platform?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/signup"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Create a new account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
