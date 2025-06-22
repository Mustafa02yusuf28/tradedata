'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      let data: unknown = {};
      try {
        data = await res.json();
      } catch {
        // If not JSON, fallback to a generic error
        throw new Error('Internal server error');
      }

      if (!res.ok) {
        const errorMsg =
          typeof data === 'object' && data !== null && 'error' in data
            ? (data as { error: string }).error
            : `${isLogin ? 'Login' : 'Registration'} failed`;
        throw new Error(errorMsg);
      }

      // Show success notification
      setShowSuccess(true);
      
      // Trigger success callback after a short delay, but don't call onClose
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      }, 1500); // Wait for 1.5 seconds to show the success message
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-main-center">
          <div className="stat-card-auth-modal-content">
            {/* Close button as first child */}
            <button
              onClick={onClose}
              className="auth-modal-close"
              aria-label="Close"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content follows */}
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#00ffcc] to-[#0080ff] bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg auth-modal-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-modal-form">
              {!isLogin && (
                <div className="auth-modal-field">
                  <label htmlFor="name" className="block text-sm font-medium text-white/70">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-modal-input w-full border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffcc] focus:ring-2 focus:ring-[#00ffcc] shadow-md transition-all duration-200"
                    placeholder="Your Name"
                    required
                  />
                </div>
              )}

              <div className="auth-modal-field">
                <label htmlFor="email" className="block text-sm font-medium text-white/70">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-modal-input w-full border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffcc] focus:ring-2 focus:ring-[#00ffcc] shadow-md transition-all duration-200"
                  placeholder="you@email.com"
                  required
                />
              </div>

              <div className="auth-modal-field">
                <label htmlFor="password" className="block text-sm font-medium text-white/70">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-modal-input w-full border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffcc] focus:ring-2 focus:ring-[#00ffcc] shadow-md transition-all duration-200"
                  placeholder="Password"
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-modal-btn w-full mt-4"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-white/70 auth-modal-switch">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="auth-modal-link-btn"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-[#00ffcc] text-black px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-out z-[60]">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold">Signed in successfully!</span>
        </div>
      )}
    </>
  );
} 