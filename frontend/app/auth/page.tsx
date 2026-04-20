'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsLoading(true);

    try {
      if (!isSignIn) {
        if (formData.password !== formData.confirmPassword) {
          setStatusMessage('Passwords do not match.');
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });
        if (error) {
          setStatusMessage(error.message || 'Registration failed.');
          return;
        }

        setStatusMessage('Account created. Check your email verification if enabled, then sign in.');
        setIsSignIn(true);
        setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error || !data.user) {
        setStatusMessage(error?.message || 'Sign in failed.');
        return;
      }
      const displayName =
        (data.user.user_metadata?.name as string | undefined) || data.user.email || 'student';
      setStatusMessage(`Welcome back, ${displayName}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setStatusMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    if (error) {
      setStatusMessage(error.message || `Failed to continue with ${provider}.`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen flex items-center justify-center py-12 px-4 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {isSignIn ? 'Welcome Back' : 'Join Us'}
              </h1>
              <p className="text-muted-foreground">
                {isSignIn ? 'Sign in to access your learning journey' : 'Create an account to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required={!isSignIn}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
              </div>

              {!isSignIn && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required={!isSignIn}
                    />
                  </div>
                </div>
              )}

              {isSignIn && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-secondary hover:text-secondary/80 font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              {statusMessage && (
                <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-11 font-semibold"
              >
                {isLoading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground"
                onClick={() => void handleOAuth('google')}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
                onClick={() => void handleOAuth('facebook')}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                  <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 1.9v2.3h3.4l-.5 3.5h-2.9V24C19.6 23.1 24 18.1 24 12.1z" />
                </svg>
                Facebook
              </Button>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignIn ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="text-secondary hover:text-secondary/80 font-medium"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-secondary hover:text-secondary/80 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-secondary hover:text-secondary/80 font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
