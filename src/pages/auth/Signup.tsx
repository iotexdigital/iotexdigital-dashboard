import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Zap } from 'lucide-react';

export function Signup() {
  const { signup, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogoError = () => setLogoError(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await signup(formData.name, formData.email, formData.password);

    if (!result.success) {
      setError(result.error || 'Signup failed');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/90 to-yellow-600/90"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-gray-900">
          <div className="flex flex-col items-center mb-8">
            {!logoError ? (
              <img
                src="/logo.svg"
                alt="IoTeXDigital Logo"
                className="h-20 w-auto max-h-20 object-contain filter drop-shadow-lg brightness-110 contrast-110"
                style={{ maxWidth: '600px', minHeight: '80px' }}
                onError={handleLogoError}
              />
            ) : (
              <div className="h-20 w-20 bg-gray-900/20 rounded-lg flex items-center justify-center border border-gray-900/30 filter drop-shadow-lg">
                <Zap className="w-12 h-12 text-gray-900" />
              </div>
            )}
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold mb-6 text-center lg:text-left">
            Join the Future of IoT Operations
          </h1>

          <p className="text-lg xl:text-xl opacity-90 mb-8 text-center lg:text-left">
            Get started with our enterprise-grade IoT platform and transform how you monitor and optimize your operations.
          </p>

          <div className="space-y-4 text-base">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span>Free 30-day trial</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span>24/7 support included</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/20 rounded-full"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-yellow-500/20 rounded-full"></div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img
              src="/logo.svg"
              alt="IoTeXDigital Logo"
              className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-lg brightness-110 contrast-110"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-gray-400">Start your IoT journey today</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
