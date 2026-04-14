'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';

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

        const registerResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const registerData = (await registerResponse.json()) as { error?: string };
        if (!registerResponse.ok) {
          setStatusMessage(registerData.error || 'Registration failed.');
          return;
        }

        setStatusMessage('Account created. You can now sign in.');
        setIsSignIn(true);
        setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
        return;
      }

      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = (await loginResponse.json()) as {
        error?: string;
        user?: { id: string; name: string; email: string };
      };

      if (!loginResponse.ok || !loginData.user) {
        setStatusMessage(loginData.error || 'Sign in failed.');
        return;
      }

      localStorage.setItem('pj_user', JSON.stringify(loginData.user));
      setStatusMessage(`Welcome back, ${loginData.user.name}.`);
    } finally {
      setIsLoading(false);
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
              <Button variant="outline" className="border-border text-foreground">
                Google
              </Button>
              <Button variant="outline" className="border-border text-foreground">
                GitHub
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
              <a href="#" className="text-secondary hover:text-secondary/80 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-secondary hover:text-secondary/80 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
