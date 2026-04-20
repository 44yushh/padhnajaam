'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAllowedAdminEmail } from '@/lib/admin-allowlist';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (isAllowedAdminEmail(session?.user?.email ?? null)) {
        router.replace('/admin/dashboard');
        return;
      }
      router.replace('/admin/login');
    };
    void checkAuth();
  }, [router]);

  return <div className="min-h-screen bg-background" />;
}
