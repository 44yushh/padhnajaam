'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ADMIN_EMAIL, ADMIN_PASSWORD, isAdminLoggedIn, setAdminLoggedIn } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAdminLoggedIn(true);
      router.replace('/admin/dashboard');
      return;
    }

    setError('Invalid admin credentials');
  };

  return (
    <main className="min-h-screen bg-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">Use demo admin credentials to continue.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-border rounded-md px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Log In
          </Button>
        </form>
      </div>
    </main>
  );
}
