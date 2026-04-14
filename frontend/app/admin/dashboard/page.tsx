'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, FileText, Clock3 } from 'lucide-react';
import { isAdminLoggedIn, setAdminLoggedIn } from '@/lib/admin-auth';
import { type StoredNote } from '@/lib/structure-types';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [notes, setNotes] = useState<StoredNote[]>([]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace('/admin/login');
      return;
    }
    setCheckedAuth(true);
  }, [router]);

  useEffect(() => {
    const loadUsers = async () => {
      const [usersResponse, notesResponse] = await Promise.all([fetch('/api/users'), fetch('/api/notes')]);
      if (usersResponse.ok) {
        const data = (await usersResponse.json()) as { users: RegisteredUser[] };
        setUsers(data.users);
      }
      if (notesResponse.ok) {
        const data = (await notesResponse.json()) as { notes: StoredNote[] };
        setNotes(data.notes);
      }
    };
    if (checkedAuth) {
      void loadUsers();
    }
  }, [checkedAuth]);

  const pendingApprovals = useMemo(() => 0, []);

  const handleLogout = () => {
    setAdminLoggedIn(false);
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
          <p className="text-sm text-muted-foreground mt-1">Manage notes and users for tonight&apos;s demo.</p>

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
                Total Notes
              </p>
              <p className="text-2xl font-bold mt-2">{notes.length}</p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-white">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-secondary" />
                Total Users
              </p>
              <p className="text-2xl font-bold mt-2">{users.length}</p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-white">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-secondary" />
                Pending Approvals
              </p>
              <p className="text-2xl font-bold mt-2">{pendingApprovals}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
