import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

// Declare Turnstile types
declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement | string, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Load Turnstile script
  useEffect(() => {
    const loadTurnstileScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[src*="turnstile"]')) {
          if (window.turnstile) {
            setScriptLoaded(true);
            resolve();
          } else {
            const checkTurnstile = setInterval(() => {
              if (window.turnstile) {
                clearInterval(checkTurnstile);
                setScriptLoaded(true);
                resolve();
              }
            }, 100);
            setTimeout(() => {
              clearInterval(checkTurnstile);
              reject(new Error('Turnstile script load timeout'));
            }, 10000);
          }
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
          const checkTurnstile = setInterval(() => {
            if (window.turnstile) {
              clearInterval(checkTurnstile);
              setScriptLoaded(true);
              resolve();
            }
          }, 100);

          setTimeout(() => {
            clearInterval(checkTurnstile);
            reject(new Error('Turnstile not available after script load'));
          }, 5000);
        };

        script.onerror = () => reject(new Error('Failed to load Turnstile script'));
        document.head.appendChild(script);
      });
    };

    loadTurnstileScript().catch((error) => {
      console.error('Error loading Turnstile:', error);
      setError('Failed to load CAPTCHA. Please refresh the page.');
    });
  }, []);

  // Initialize Turnstile widget
  useEffect(() => {
    if (scriptLoaded && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: '0x4AAAAAAB4EQj83AtClzBse',
          theme: 'dark',
          callback: (token: string) => {
            setTurnstileToken(token);
            setError('');
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
          'error-callback': () => {
            setTurnstileToken('');
            setError('CAPTCHA verification failed. Please try again.');
          }
        });
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
        setError('Failed to initialize CAPTCHA. Please refresh the page.');
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error('Error removing Turnstile widget:', error);
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded]);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const resetTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken('');
      } catch (error) {
        console.error('Error resetting Turnstile:', error);
      }
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@iotexdigital.com');
    setPassword('admin123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    if (!turnstileToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password);

      if (!result.success) {
        setError(result.error || 'Invalid email or password. Please try again.');
        resetTurnstile();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="relative z-10 flex flex-col justify-center px-12 text-gray-900">
          <img
            src="/logo.svg"
            alt="IoTeXDigital Logo"
            className="h-16 md:h-20 w-auto mx-auto mb-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
            Transform Your IoT Operations with AI Intelligence
          </h1>
          <p className="text-base md:text-xl opacity-90 mb-8 text-center">
            Real-time monitoring, predictive analytics, and automated optimization
            to maximize your operational efficiency.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img
              src="/logo.svg"
              alt="IoTeXDigital Logo"
              className="h-14 sm:h-16 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Welcome back</h2>
            <p className="text-gray-400">Sign in to your dashboard</p>
          </div>

      

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Turnstile CAPTCHA */}
            <div className="flex justify-center">
              <div ref={turnstileRef} className="min-h-[65px] w-full flex items-center justify-center">
                {!scriptLoaded && (
                  <div className="text-gray-400 text-sm">Loading CAPTCHA...</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken || !email.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>

              {/* Demo Credentials Banner */}
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-yellow-400 text-sm font-medium mb-2">Demo Credentials</p>
                <p className="text-gray-300 text-xs mb-1">Email: admin@iotexdigital.com</p>
                <p className="text-gray-300 text-xs">Password: admin123</p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="ml-3 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-medium rounded border border-yellow-500/30 transition-colors"
              >
                Use Demo
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}