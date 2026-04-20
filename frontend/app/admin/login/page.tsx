'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { isAllowedAdminEmail } from '@/lib/admin-allowlist';

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (isAllowedAdminEmail(session?.user?.email ?? null)) {
        router.replace('/admin/dashboard');
        return;
      }
      if (session) setStatus('Access denied: this account does not have admin privileges.');
    };
    void checkAuth();
  }, [router]);

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    setStatus('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    if (error) {
      setStatus(error.message || `Unable to continue with ${provider}.`);
    }
  };

  return (
    <main className="min-h-screen bg-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Continue with Google or Facebook. Allowed emails are redirected to the admin dashboard.
        </p>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-border text-foreground"
            onClick={() => void signInWithProvider('google')}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12z" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
            onClick={() => void signInWithProvider('facebook')}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
              <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 1.9v2.3h3.4l-.5 3.5h-2.9V24C19.6 23.1 24 18.1 24 12.1z" />
            </svg>
            Facebook
          </Button>
        </div>
        {status && <p className="text-sm text-destructive mt-4">{status}</p>}
      </div>
    </main>
  );
}
