'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAllowedAdminEmail } from '@/lib/admin-allowlist';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', `${url.pathname}${url.search}`);
      }
      const code = url.searchParams.get('code');

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const email = session?.user?.email ?? null;
      if (isAllowedAdminEmail(email)) {
        router.replace('/admin/dashboard');
        return;
      }

      router.replace('/');
    };

    void handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Finalizing login...</p>
    </main>
  );
}
