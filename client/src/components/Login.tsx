import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onBack: () => void;
  onSwitchToSignup: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onSwitchToSignup, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 theme-transition">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-purple-900/20 to-cyan-900/20 theme-transition"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <Shield className="h-10 w-10 text-cyan-400" />
              <div className="absolute inset-0 h-10 w-10 text-cyan-400 animate-pulse opacity-50">
                <Shield className="h-10 w-10" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">Charlieverse</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 card-transition">
          {error && (
            <div className="mb-4 p-3 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-foreground">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Don't have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToSignup}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
            >
              Create your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;