'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { isAllowedAdminEmail } from '@/lib/admin-allowlist';

interface StructureRow {
  id: string;
  university: string;
  faculty: string;
  program: string;
  subject: string;
  academic_level: 'Bachelor' | 'Masters';
  system_type: 'Semester System' | 'Yearly System';
  duration: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function AdminManagePage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [rows, setRows] = useState<StructureRow[]>([]);
  const [universityName, setUniversityName] = useState('');
  const [facultyUniversityId, setFacultyUniversityId] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [programUniversityId, setProgramUniversityId] = useState('');
  const [programFacultyId, setProgramFacultyId] = useState('');
  const [programName, setProgramName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [academicLevel, setAcademicLevel] = useState<'Bachelor' | 'Masters'>('Bachelor');
  const [systemType, setSystemType] = useState<'Semester System' | 'Yearly System'>('Semester System');
  const [duration, setDuration] = useState(8);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadData = async () => {
    const { data, error } = await supabase
      .from('academic_structure')
      .select('id, university, faculty, program, subject, academic_level, system_type, duration')
      .order('created_at', { ascending: false });

    if (error) {
      showToast(`Failed to load data: ${error.message}`, 'error');
      return;
    }

    const loadedRows = (data ?? []) as StructureRow[];
    setRows(loadedRows);

    const allUniversities = [...new Set(loadedRows.map((r) => r.university))];
    const firstUni = allUniversities[0] ?? '';

    setFacultyUniversityId((prev) => (allUniversities.includes(prev) ? prev : firstUni));
    setProgramUniversityId((prev) => {
      const uni = allUniversities.includes(prev) ? prev : firstUni;
      const faculties = [...new Set(loadedRows.filter((r) => r.university === uni).map((r) => r.faculty))];
      setProgramFacultyId((prevFac) => (faculties.includes(prevFac) ? prevFac : faculties[0] ?? ''));
      return uni;
    });
  };

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
    if (checkedAuth) {
      void loadData();
    }
  }, [checkedAuth]);

  const universities = useMemo(() => [...new Set(rows.map((row) => row.university))], [rows]);
  const faculties = useMemo(
    () => [...new Set(rows.filter((row) => row.university === programUniversityId).map((row) => row.faculty))],
    [rows, programUniversityId]
  );
  const hierarchyRows = useMemo(() => {
    const map = new Map<string, StructureRow>();
    rows.forEach((row) => map.set(`${row.university}|${row.faculty}|${row.program}|${row.subject}`, row));
    return Array.from(map.values());
  }, [rows]);

  const createUniversity = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('academic_structure').insert({
      university: universityName.trim(),
      faculty: 'General',
      program: 'General Program',
      subject: 'General Subject',
      academic_level: 'Bachelor',
      system_type: 'Semester System',
      duration: 8,
    });
    if (error) {
      showToast(`Failed to add university: ${error.message}`, 'error');
      return;
    }
    showToast(`University "${universityName.trim()}" added successfully!`, 'success');
    setUniversityName('');
    await loadData();
  };

  const createFaculty = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('academic_structure').insert({
      university: facultyUniversityId,
      faculty: facultyName.trim(),
      program: 'General Program',
      subject: 'General Subject',
      academic_level: 'Bachelor',
      system_type: 'Semester System',
      duration: 8,
    });
    if (error) {
      showToast(`Failed to add faculty: ${error.message}`, 'error');
      return;
    }
    showToast(`Faculty "${facultyName.trim()}" added successfully!`, 'success');
    setFacultyName('');
    await loadData();
  };

  const createProgram = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('academic_structure').insert({
      university: programUniversityId,
      faculty: programFacultyId,
      program: programName.trim(),
      subject: subjectName.trim(),
      academic_level: academicLevel,
      system_type: systemType,
      duration,
    });
    if (error) {
      showToast(`Failed to add program: ${error.message}`, 'error');
      return;
    }
    showToast(`Program "${programName.trim()}" added successfully!`, 'success');
    setProgramName('');
    setSubjectName('');
    await loadData();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('academic_structure').delete().eq('id', id);
    if (error) {
      showToast(`Failed to delete: ${error.message}`, 'error');
      return;
    }
    showToast('Row deleted successfully.', 'success');
    await loadData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (!checkedAuth) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 min-w-[280px] ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <AdminSidebar activeTab="manage" onLogout={handleLogout} />
      <main className="flex-1 p-6 md:p-8 md:ml-0 mt-12 md:mt-0">
        <div className="bg-white border border-border rounded-xl p-5 md:p-7 space-y-8">
          <h1 className="text-2xl font-bold text-foreground">Management</h1>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form onSubmit={createUniversity} className="border border-border rounded-lg p-4 space-y-3">
              <h2 className="font-semibold">Create University</h2>
              <input
                value={universityName}
                onChange={(event) => setUniversityName(event.target.value)}
                placeholder="University name"
                className="w-full border border-border rounded-md px-3 py-2"
                required
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Add University</Button>
            </form>

            <form onSubmit={createFaculty} className="border border-border rounded-lg p-4 space-y-3">
              <h2 className="font-semibold">Create Faculty</h2>
              <select
                value={facultyUniversityId}
                onChange={(event) => setFacultyUniversityId(event.target.value)}
                className="w-full border border-border rounded-md px-3 py-2"
                required
              >
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
              <input
                value={facultyName}
                onChange={(event) => setFacultyName(event.target.value)}
                placeholder="Faculty name"
                className="w-full border border-border rounded-md px-3 py-2"
                required
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Add Faculty</Button>
            </form>

            <form onSubmit={createProgram} className="border border-border rounded-lg p-4 space-y-3 md:col-span-2">
              <h2 className="font-semibold">Academic Skeleton Manager</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={programUniversityId}
                  onChange={(event) => {
                    const selectedUni = event.target.value;
                    setProgramUniversityId(selectedUni);
                    const newFaculties = [...new Set(rows.filter((row) => row.university === selectedUni).map((row) => row.faculty))];
                    setProgramFacultyId(newFaculties[0] ?? '');
                  }}
                  className="w-full border border-border rounded-md px-3 py-2"
                  required
                >
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
                <select
                  value={programFacultyId}
                  onChange={(event) => setProgramFacultyId(event.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2"
                  required
                >
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
                <input
                  value={programName}
                  onChange={(event) => setProgramName(event.target.value)}
                  placeholder="Program name"
                  className="w-full border border-border rounded-md px-3 py-2"
                  required
                />
                <input
                  value={subjectName}
                  onChange={(event) => setSubjectName(event.target.value)}
                  placeholder="Subject name"
                  className="w-full border border-border rounded-md px-3 py-2"
                  required
                />
                <select
                  value={academicLevel}
                  onChange={(event) => setAcademicLevel(event.target.value as 'Bachelor' | 'Masters')}
                  className="w-full border border-border rounded-md px-3 py-2"
                >
                  <option value="Bachelor">Bachelor</option>
                  <option value="Masters">Masters</option>
                </select>
                <select
                  value={systemType}
                  onChange={(event) => setSystemType(event.target.value as 'Semester System' | 'Yearly System')}
                  className="w-full border border-border rounded-md px-3 py-2"
                >
                  <option value="Semester System">Semester System</option>
                  <option value="Yearly System">Yearly System</option>
                </select>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value) || 1)}
                  className="w-full border border-border rounded-md px-3 py-2"
                  placeholder="Duration"
                />
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Add Program</Button>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">Hierarchy</h2>
            {hierarchyRows.length === 0 && (
              <p className="text-sm text-muted-foreground">No data yet. Add a university to get started.</p>
            )}
            {hierarchyRows.map((row) => (
              <div key={row.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-sm">
                    <p className="font-semibold">
                      {row.university} → {row.faculty} → {row.program}
                    </p>
                    <p className="text-muted-foreground">
                      {row.subject} | {row.academic_level} | {row.system_type} | Duration {row.duration}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => void deleteItem(row.id)}>
                    Delete Row
                  </Button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}