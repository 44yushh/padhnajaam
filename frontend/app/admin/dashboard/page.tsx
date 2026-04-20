'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { FileText, FolderTree, Clock3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isAllowedAdminEmail } from '@/lib/admin-allowlist';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentUploads, setRecentUploads] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !isAllowedAdminEmail(session.user.email ?? null)) {
        router.replace('/admin/login');
        return;
      }
      setCheckedAuth(true);
    };
    void checkAuth();
  }, [router]);

  useEffect(() => {
    const loadStats = async () => {
      const { count: documentsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });
      setTotalDocuments(documentsCount ?? 0);

      const { data: categoryRows } = await supabase.from('documents').select('category');
      setTotalCategories(new Set((categoryRows ?? []).map((row) => row.category)).size);

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      const { count: recentCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', cutoff.toISOString());
      setRecentUploads(recentCount ?? 0);
    };
    if (checkedAuth) {
      void loadStats();
    }
  }, [checkedAuth]);

  useEffect(() => {
    if (!checkedAuth) return;
    const channel = supabase
      .channel('admin-dashboard-documents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => {
        void (async () => {
          const { count: documentsCount } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true });
          setTotalDocuments(documentsCount ?? 0);
        })();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [checkedAuth]);

  const pendingApprovals = useMemo(() => 0, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (!checkedAuth) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">
      <AdminSidebar activeTab="dashboard" onLogout={handleLogout} />

      <main className="flex-1 p-6 md:p-8 md:ml-0 mt-12 md:mt-0">
        <div className="bg-white border border-border rounded-xl p-5 md:p-7">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Live analytics from Supabase.</p>

          <Link href="/admin/upload" className="inline-block mt-4">
            <Button variant="outline" className="border-secondary/40 text-secondary hover:bg-secondary/10">
              Open Upload Portal
            </Button>
          </Link>
          <Link href="/admin/manage" className="inline-block mt-4 ml-3">
            <Button variant="outline" className="border-secondary/40 text-secondary hover:bg-secondary/10">
              Open Management
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg border border-border p-4 bg-white">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                Total Documents
              </p>
              <p className="text-2xl font-bold mt-2">{totalDocuments}</p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-white">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-secondary" />
                Categories
              </p>
              <p className="text-2xl font-bold mt-2">{totalCategories}</p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-white">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-secondary" />
                Recent Uploads (7d)
              </p>
              <p className="text-2xl font-bold mt-2">{recentUploads || pendingApprovals}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
