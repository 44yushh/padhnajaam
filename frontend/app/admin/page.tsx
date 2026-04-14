'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.replace('/admin/dashboard');
      return;
    }
    router.replace('/admin/login');
  }, [router]);

  return <div className="min-h-screen bg-background" />;
}
