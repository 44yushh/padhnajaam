'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { isAdminLoggedIn, setAdminLoggedIn } from '@/lib/admin-auth';
import { type StoredNote, type StructureStore } from '@/lib/structure-types';

export default function AdminManagePage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [structure, setStructure] = useState<StructureStore>({ universities: [] });
  const [notes, setNotes] = useState<StoredNote[]>([]);
  const [universityName, setUniversityName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [facultyUniversityId, setFacultyUniversityId] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [programUniversityId, setProgramUniversityId] = useState('');
  const [programFacultyId, setProgramFacultyId] = useState('');
  const [programName, setProgramName] = useState('');

  const loadData = async () => {
    const [structureRes, notesRes] = await Promise.all([fetch('/api/structure'), fetch('/api/notes')]);
    if (structureRes.ok) {
      const payload = (await structureRes.json()) as { structure: StructureStore };
      setStructure(payload.structure);
      if (!facultyUniversityId) {
        setFacultyUniversityId(payload.structure.universities[0]?.id || '');
      }
      if (!programUniversityId) {
        setProgramUniversityId(payload.structure.universities[0]?.id || '');
      }
    }
    if (notesRes.ok) {
      const payload = (await notesRes.json()) as { notes: StoredNote[] };
      setNotes(payload.notes);
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace('/admin/login');
      return;
    }
    setCheckedAuth(true);
  }, [router]);

  useEffect(() => {
    if (checkedAuth) {
      void loadData();
    }
  }, [checkedAuth]);

  const selectedProgramUniversity = structure.universities.find((item) => item.id === programUniversityId);
  const selectedProgramFaculty =
    selectedProgramUniversity?.faculties.find((item) => item.id === programFacultyId) || null;

  const notesByProgramId = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach((note) => {
      const key = note.programId || '';
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [notes]);

  const createUniversity = async (event: FormEvent) => {
    event.preventDefault();
    await fetch('/api/structure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createUniversity', name: universityName, logoUrl }),
    });
    setUniversityName('');
    setLogoUrl('');
    await loadData();
  };

  const createFaculty = async (event: FormEvent) => {
    event.preventDefault();
    await fetch('/api/structure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createFaculty',
        universityId: facultyUniversityId,
        name: facultyName,
      }),
    });
    setFacultyName('');
    await loadData();
  };

  const createProgram = async (event: FormEvent) => {
    event.preventDefault();
    await fetch('/api/structure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createProgram',
        universityId: programUniversityId,
        facultyId: programFacultyId,
        name: programName,
      }),
    });
    setProgramName('');
    await loadData();
  };

  const deleteItem = async (payload: object) => {
    await fetch('/api/structure', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await loadData();
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    router.replace('/admin/login');
  };

  if (!checkedAuth) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">
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
              <input
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                placeholder="Logo URL"
                className="w-full border border-border rounded-md px-3 py-2"
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
                {structure.universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
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
              <h2 className="font-semibold">Create Program</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={programUniversityId}
                  onChange={(event) => {
                    const university = structure.universities.find((item) => item.id === event.target.value);
                    setProgramUniversityId(event.target.value);
                    setProgramFacultyId(university?.faculties[0]?.id || '');
                  }}
                  className="w-full border border-border rounded-md px-3 py-2"
                  required
                >
                  {structure.universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
                <select
                  value={programFacultyId}
                  onChange={(event) => setProgramFacultyId(event.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2"
                  required
                >
                  {(selectedProgramUniversity?.faculties || []).map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
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
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Add Program</Button>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">Hierarchy</h2>
            {structure.universities.map((uni) => (
              <div key={uni.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{uni.name}</p>
                    <p className="text-xs text-muted-foreground">{uni.logoUrl || 'No logo URL'}</p>
                  </div>
                  <Button
                    variant="outline"
                    disabled={uni.faculties.length > 0}
                    onClick={() => void deleteItem({ level: 'university', universityId: uni.id })}
                  >
                    Delete
                  </Button>
                </div>

                {uni.faculties.map((faculty) => (
                  <div key={faculty.id} className="ml-4 border-l pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{faculty.name}</p>
                      <Button
                        variant="outline"
                        disabled={faculty.programs.length > 0}
                        onClick={() =>
                          void deleteItem({
                            level: 'faculty',
                            universityId: uni.id,
                            facultyId: faculty.id,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>

                    {faculty.programs.map((program) => {
                      const noteCount = notesByProgramId.get(program.id) || 0;
                      return (
                        <div key={program.id} className="ml-4 flex items-center justify-between">
                          <p className="text-sm">
                            {program.name} ({program.semesters.join(', ')})
                          </p>
                          <Button
                            variant="outline"
                            disabled={noteCount > 0}
                            onClick={() =>
                              void deleteItem({
                                level: 'program',
                                universityId: uni.id,
                                facultyId: faculty.id,
                                programId: program.id,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
