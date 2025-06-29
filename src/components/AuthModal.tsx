import React, { useState } from 'react';
import { X, Mail, Lock, User, Building, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { signUp, signIn, resetPassword } from '../lib/supabase';

interface AuthModalProps {
  mode: 'login' | 'signup' | 'admin';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup' | 'admin') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'researcher',
    orgName: '',
    subscribed: true,
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const userData = {
          user_type: formData.userType,
          org_name: formData.orgName,
          subscribed: formData.subscribed
        };

        const { data, error } = await signUp(formData.email, formData.password, userData);
        
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created! Please check your email to verify your account.');
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      } else if (mode === 'login') {
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Login successful!');
          setTimeout(() => {
            onClose();
            window.location.href = '/dashboard';
          }, 1000);
        }
      } else if (mode === 'admin') {
        if (step === 1) {
          // Simulate OTP sending
          setStep(2);
          setSuccess('OTP sent to your email');
        } else {
          // Simulate OTP verification
          if (formData.otp === '123456') {
            setSuccess('Admin login successful!');
            setTimeout(() => {
              onClose();
              window.location.href = '/admin';
            }, 1000);
          } else {
            setError('Invalid OTP. Please try again.');
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(formData.email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset email sent!');
    }
    
    setIsLoading(false);
  };

  const renderLogin = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Forgot password?
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('signup')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign up
        </button>
      </div>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {/* Onboarding Survey */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-900">Tell us about yourself</h4>
        
        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
            What best describes you?
          </label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="researcher">Researcher</option>
            <option value="ngo">NGO</option>
            <option value="health_dept">Health Department</option>
            <option value="student">Student</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name (Optional)
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="orgName"
              name="orgName"
              value={formData.orgName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your organization"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="subscribed"
            name="subscribed"
            checked={formData.subscribed}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="subscribed" className="text-sm text-gray-700">
            Subscribe to early updates & research alerts
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Sign Up & Verify Email'}
      </button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign in
        </button>
      </div>
    </form>
  );

  const renderAdmin = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {step === 1 ? (
        <>
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Admin Access</h3>
            <p className="text-sm text-gray-600">Secure login with one-time passcode</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="admin@prevora.ai"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
            <p className="text-sm text-gray-600">We've sent a one-time passcode to {formData.email}</p>
            <p className="text-xs text-gray-500 mt-2">For demo purposes, use: 123456</p>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              required
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify & Log In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Resend OTP
            </button>
          </div>
        </>
      )}

      <div className="text-center text-sm text-gray-600">
        Not an admin?{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          User login
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome to Prevora</h2>
              <p className="text-blue-100 text-sm">
                {mode === 'login' && 'Sign in to your account'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'admin' && 'Admin portal access'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => onSwitchMode('login')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => onSwitchMode('signup')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => onSwitchMode('admin')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              mode === 'admin'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'login' && renderLogin()}
          {mode === 'signup' && renderSignup()}
          {mode === 'admin' && renderAdmin()}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            By continuing you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a> &{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;