'use client';

import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { isAdminLoggedIn, setAdminLoggedIn } from '@/lib/admin-auth';
import { type StoredNote, type StructureStore } from '@/lib/structure-types';

export default function AdminUploadPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [structure, setStructure] = useState<StructureStore>({ universities: [] });
  const [notes, setNotes] = useState<StoredNote[]>([]);
  const [formState, setFormState] = useState({
    title: '',
    subject: 'Corporate Finance',
    universityId: '',
    facultyId: '',
    programId: '',
    semester: '',
    fileName: '',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  });

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace('/admin/login');
      return;
    }
    setCheckedAuth(true);
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      const [structureRes, notesRes] = await Promise.all([fetch('/api/structure'), fetch('/api/notes')]);
      if (structureRes.ok) {
        const structurePayload = (await structureRes.json()) as { structure: StructureStore };
        setStructure(structurePayload.structure);
        const firstUniversity = structurePayload.structure.universities[0];
        const firstFaculty = firstUniversity?.faculties[0];
        const firstProgram = firstFaculty?.programs[0];
        setFormState((prev) => ({
          ...prev,
          universityId: firstUniversity?.id || '',
          facultyId: firstFaculty?.id || '',
          programId: firstProgram?.id || '',
          semester: firstProgram?.semesters[0] || '',
        }));
      }
      if (notesRes.ok) {
        const notesPayload = (await notesRes.json()) as { notes: StoredNote[] };
        setNotes(notesPayload.notes);
      }
    };

    if (checkedAuth) {
      void loadData();
    }
  }, [checkedAuth]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFormState((prev) => ({ ...prev, fileName: selectedFile.name }));
  };

  const selectedUniversity = structure.universities.find((item) => item.id === formState.universityId);
  const availableFaculties = selectedUniversity?.faculties || [];
  const selectedFaculty = availableFaculties.find((item) => item.id === formState.facultyId);
  const availablePrograms = selectedFaculty?.programs || [];
  const selectedProgram = availablePrograms.find((item) => item.id === formState.programId);
  const availableSemesters = selectedProgram?.semesters || [];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const uploadNote = async () => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formState.title,
          subject: formState.subject,
          semester: formState.semester,
          previewUrl: formState.previewUrl,
          universityId: formState.universityId,
          facultyId: formState.facultyId,
          programId: formState.programId,
        }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { note: StoredNote };
      setNotes((prev) => [payload.note, ...prev]);
      setFormState((prev) => ({ ...prev, title: '', fileName: '' }));
    };
    void uploadNote();
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    router.replace('/admin/login');
  };

  if (!checkedAuth) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">
      <AdminSidebar activeTab="upload" onLogout={handleLogout} />
      <main className="flex-1 px-4 py-8 sm:px-8 md:ml-0 mt-12 md:mt-0">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Upload Portal</h1>
              <p className="text-sm text-muted-foreground">
                Faculty and Program options now depend on the selected University.
              </p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Admin</Button>
            </Link>
          </div>

          <section className="rounded-xl border border-border bg-white p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Chapter Title</label>
                <input
                  required
                  value={formState.title}
                  onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2"
                  placeholder="Enter chapter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  required
                  value={formState.subject}
                  onChange={(event) => setFormState((prev) => ({ ...prev, subject: event.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2"
                  placeholder="Corporate Finance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <select
                  value={formState.universityId}
                  onChange={(event) => {
                    const university = structure.universities.find((item) => item.id === event.target.value);
                    const faculty = university?.faculties[0];
                    const program = faculty?.programs[0];
                    setFormState((prev) => ({
                      ...prev,
                      universityId: event.target.value,
                      facultyId: faculty?.id || '',
                      programId: program?.id || '',
                      semester: program?.semesters[0] || '',
                    }));
                  }}
                  className="w-full border border-border rounded-md px-3 py-2"
                >
                  {structure.universities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Faculty</label>
                <select
                  value={formState.facultyId}
                  onChange={(event) => {
                    const faculty = availableFaculties.find((item) => item.id === event.target.value);
                    const program = faculty?.programs[0];
                    setFormState((prev) => ({
                      ...prev,
                      facultyId: event.target.value,
                      programId: program?.id || '',
                      semester: program?.semesters[0] || '',
                    }));
                  }}
                  className="w-full border border-border rounded-md px-3 py-2"
                  disabled={availableFaculties.length === 0}
                >
                  {availableFaculties.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Program</label>
                <select
                  value={formState.programId}
                  onChange={(event) => {
                    const program = availablePrograms.find((item) => item.id === event.target.value);
                    setFormState((prev) => ({
                      ...prev,
                      programId: event.target.value,
                      semester: program?.semesters[0] || '',
                    }));
                  }}
                  className="w-full border border-border rounded-md px-3 py-2"
                  disabled={availablePrograms.length === 0}
                >
                  {availablePrograms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <select
                  value={formState.semester}
                  onChange={(event) => setFormState((prev) => ({ ...prev, semester: event.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2"
                  disabled={availableSemesters.length === 0}
                >
                  {availableSemesters.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full border border-border rounded-md px-3 py-2 file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-secondary file:text-secondary-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Save Note to JSON
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 sm:p-6 mt-6">
            <h2 className="text-lg font-semibold">Notes Saved</h2>
            <div className="mt-3 space-y-3">
              {notes.length === 0 && (
                <p className="text-sm text-muted-foreground">No notes yet. Submit the form above.</p>
              )}
              {notes.map((item) => (
                <div key={item.id} className="rounded-md border border-border p-3">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.subject} | {item.semester} semester
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.previewUrl}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
