'use client';

import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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

interface DocumentRow {
  id: string;
  title: string;
  category: string;
  semester: number;
  file_url: string | null;
  slug: string | null;
}

export default function AdminUploadPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [structureRows, setStructureRows] = useState<StructureRow[]>([]);
  const [notes, setNotes] = useState<DocumentRow[]>([]);

  const [formState, setFormState] = useState({
    title: '',
    university: '',
    faculty: '',
    program: '',
    semester: '1',
    subject: '',
    category: 'note' as 'note' | 'past_paper',
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Write professional notes here...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[220px] rounded-md border px-3 py-2 focus:outline-none',
      },
    },
  });

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const BUCKET = 'Document';

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session || !isAllowedAdminEmail(session.user.email ?? null)) {
        router.replace('/admin/login');
        return;
      }
      setCheckedAuth(true);
    };
    void checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: structureData, error: structureError } = await supabase
          .from('academic_structure')
          .select('id, university, faculty, program, subject, academic_level, system_type, duration')
          .order('created_at', { ascending: false });

        if (structureError) throw structureError;

        const rows = (structureData ?? []) as StructureRow[];
        setStructureRows(rows);
        const first = rows[0];
        if (first) {
          setFormState((prev) => ({
            ...prev,
            university: first.university,
            faculty: first.faculty,
            program: first.program,
            subject: first.subject,
            semester: '1',
          }));
        }

        const { data } = await supabase
          .from('documents')
          .select('id, title, category, semester, file_url, slug')
          .order('created_at', { ascending: false });
        if (data) setNotes(data as DocumentRow[]);
      } catch (err) {
        console.error('Initial load error:', err);
        setErrorMessage('Failed to load structure/documents from Supabase.');
      }
    };

    if (checkedAuth) loadData();
  }, [checkedAuth]);

  const universities = useMemo(
    () => [...new Set(structureRows.map((row) => row.university))],
    [structureRows]
  );
  const faculties = useMemo(
    () =>
      [...new Set(structureRows.filter((row) => row.university === formState.university).map((row) => row.faculty))],
    [structureRows, formState.university]
  );
  const programs = useMemo(
    () =>
      [
        ...new Set(
          structureRows
            .filter((row) => row.university === formState.university && row.faculty === formState.faculty)
            .map((row) => row.program)
        ),
      ],
    [structureRows, formState.university, formState.faculty]
  );
  const subjects = useMemo(
    () =>
      [
        ...new Set(
          structureRows
            .filter(
              (row) =>
                row.university === formState.university &&
                row.faculty === formState.faculty &&
                row.program === formState.program
            )
            .map((row) => row.subject)
        ),
      ],
    [structureRows, formState.university, formState.faculty, formState.program]
  );
  const selectedProgramMeta = useMemo(
    () =>
      structureRows.find(
        (row) =>
          row.university === formState.university &&
          row.faculty === formState.faculty &&
          row.program === formState.program
      ),
    [structureRows, formState.university, formState.faculty, formState.program]
  );

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(message);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 6000);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUniversityChange = (university: string) => {
    const firstFaculty = [...new Set(structureRows.filter((row) => row.university === university).map((row) => row.faculty))][0] ?? '';
    const firstProgram =
      [...new Set(structureRows.filter((row) => row.university === university && row.faculty === firstFaculty).map((row) => row.program))][0] ?? '';
    const firstSubject =
      [...new Set(structureRows.filter((row) => row.university === university && row.faculty === firstFaculty && row.program === firstProgram).map((row) => row.subject))][0] ?? '';
    setFormState((prev) => ({
      ...prev,
      university,
      faculty: firstFaculty,
      program: firstProgram,
      subject: firstSubject,
      semester: '1',
    }));
  };

  const handleFacultyChange = (faculty: string) => {
    const firstProgram =
      [...new Set(structureRows.filter((row) => row.university === formState.university && row.faculty === faculty).map((row) => row.program))][0] ?? '';
    const firstSubject =
      [...new Set(structureRows.filter((row) => row.university === formState.university && row.faculty === faculty && row.program === firstProgram).map((row) => row.subject))][0] ?? '';
    setFormState((prev) => ({
      ...prev,
      faculty,
      program: firstProgram,
      subject: firstSubject,
      semester: '1',
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formState.program) {
      showToast('Program is still loading — please wait a moment and try again.', 'error');
      return;
    }
    if (!formState.title.trim()) {
      showToast('Please enter a title.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      let publicUrl: string | null = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, selectedFile);
        if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);
        const {
          data: { publicUrl: uploadedPublicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        publicUrl = uploadedPublicUrl;
      }

      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            title: formState.title.trim(),
            slug: `${slugify(formState.title)}-${Date.now()}`,
            university: formState.university,
            faculty: formState.faculty,
            program: formState.program,
            subject: formState.subject,
            program_id: null,
            semester: parseInt(formState.semester) || 1,
            file_url: publicUrl,
            category: formState.category,
            uploaded_by: 'Admin',
            content: editor?.getHTML() ?? '',
            academic_level: selectedProgramMeta?.academic_level ?? 'Bachelor',
            system_type: selectedProgramMeta?.system_type ?? 'Semester System',
          },
        ])
        .select();

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      if (dbData?.[0]) setNotes((prev) => [dbData[0] as DocumentRow, ...prev]);
      setFormState((prev) => ({ ...prev, title: '' }));
      editor?.commands.setContent('<p>Write professional notes here...</p>');
      setSelectedFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      showToast('Document published to PadhnaJaam successfully!', 'success');
    } catch (error: any) {
      console.error('FULL ERROR LOG:', error);
      showToast(`Upload failed: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (!checkedAuth) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {successMessage && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-green-600 text-white text-sm font-medium min-w-[280px]">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-red-600 text-white text-sm font-medium min-w-[280px]">
            <span>❌</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <AdminSidebar activeTab="upload" onLogout={handleLogout} />
      <main className="flex-1 px-4 py-8 sm:px-8 md:ml-0 mt-12 md:mt-0">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">PadhnaJaam Cloud Upload</h1>
            <Link href="/admin/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Document Title</label>
                <input
                  required
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.title}
                  onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.category}
                  onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value as any }))}
                >
                  <option value="note">Study Note</option>
                  <option value="past_paper">Past Question</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.university}
                  onChange={(e) => handleUniversityChange(e.target.value)}
                >
                  {universities.map((university) => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Faculty</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.faculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                >
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Program</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.program}
                  onChange={(e) => {
                    const selectedProgram = e.target.value;
                    const firstSubject =
                      [...new Set(structureRows.filter((row) => row.university === formState.university && row.faculty === formState.faculty && row.program === selectedProgram).map((row) => row.subject))][0] ?? '';
                    setFormState((prev) => ({ ...prev, program: selectedProgram, subject: firstSubject }));
                  }}
                >
                  {programs.map((program) => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Semester / Year</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.semester}
                  onChange={(e) => setFormState((prev) => ({ ...prev, semester: e.target.value }))}
                >
                  {Array.from({ length: selectedProgramMeta?.duration || 8 }, (_, index) => index + 1).map((s) => (
                    <option key={s} value={s.toString()}>
                      {selectedProgramMeta?.system_type === 'Yearly System' ? `Year ${s}` : `Semester ${s}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formState.subject}
                  onChange={(e) => setFormState((prev) => ({ ...prev, subject: e.target.value }))}
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Professional Notes Content</label>
                <EditorContent editor={editor} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Optional PDF (Download Version)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={isUploading || !formState.program}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {isUploading ? 'Uploading to Cloud...' : 'Publish to PadhnaJaam'}
                </Button>
              </div>

            </form>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Live on Database</h2>
            <div className="grid gap-3">
              {notes.map((note) => (
                <div key={note.id} className="p-4 bg-white border rounded-lg flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-bold text-gray-800">{note.title}</p>
                    <p className="text-xs text-gray-500 uppercase">{note.category} | Semester {note.semester}</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    {note.slug && (
                      <Link href={`/notes/${note.slug}`} className="text-blue-600 font-medium hover:underline">
                        View Note
                      </Link>
                    )}
                    {note.file_url && (
                      <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}