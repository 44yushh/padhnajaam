'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface SessionPreview {
  email: string;
  fullName: string;
}

export default function TestAuthPage() {
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [sessionPreview, setSessionPreview] = useState<SessionPreview | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const fullName =
        (session.user.user_metadata?.full_name as string | undefined) ||
        (session.user.user_metadata?.name as string | undefined) ||
        'N/A';

      setSessionPreview({
        email: session.user.email || 'N/A',
        fullName,
      });
    };

    void loadSession();
  }, []);

  const testOAuth = async (provider: 'google' | 'facebook') => {
    setErrorMessage('');
    setLoadingProvider(provider);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (error) {
      setErrorMessage(error.message || `Failed to start ${provider} OAuth.`);
      setLoadingProvider(null);
      return;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <section className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-foreground">OAuth Auth Health Check</h1>
          <p className="text-muted-foreground mt-2">
            Use these buttons to test Supabase OAuth sign-in and session retrieval.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => void testOAuth('google')}
              disabled={loadingProvider !== null}
              variant="outline"
              className="border-border text-foreground"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12z" />
              </svg>
              {loadingProvider === 'google' ? 'Redirecting...' : 'Test Google'}
            </Button>
            <Button
              onClick={() => void testOAuth('facebook')}
              disabled={loadingProvider !== null}
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 1.9v2.3h3.4l-.5 3.5h-2.9V24C19.6 23.1 24 18.1 24 12.1z" />
              </svg>
              {loadingProvider === 'facebook' ? 'Redirecting...' : 'Test Facebook'}
            </Button>
          </div>

          {errorMessage && <p className="mt-4 text-sm text-destructive">{errorMessage}</p>}

          <div className="mt-6 rounded-lg border border-border p-4 bg-muted/30">
            <h2 className="font-semibold text-foreground mb-2">Session Check Result</h2>
            {sessionPreview ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Email:</span> {sessionPreview.email}
                </p>
                <p>
                  <span className="font-medium text-foreground">Full Name:</span>{' '}
                  {sessionPreview.fullName}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active session yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
