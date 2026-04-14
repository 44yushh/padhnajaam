import { promises as fs } from 'node:fs';
import path from 'node:path';
import { type StoredNote } from '@/lib/structure-types';

interface NoteViewerPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteViewerPage({ params }: NoteViewerPageProps) {
  const notesPath = path.join(process.cwd(), 'data', 'notes.json');
  const notesContent = await fs.readFile(notesPath, 'utf-8');
  const notes = JSON.parse(notesContent) as StoredNote[];

  if (notes.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="mt-2 text-3xl font-heading font-bold text-foreground">Coming Soon</h1>
          <p className="mt-3 text-muted-foreground">
            The PadhnaJaam Library is coming soon. Want to earn rewards? Contribute your 3rd Sem BBA Finance notes today!
          </p>
        </div>
      </main>
    );
  }

  const { id } = await params;
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground">Note not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-muted-foreground">Semester {note.semester}</p>
        <h1 className="font-heading text-3xl font-bold text-foreground mt-2">
          {note.subject}
        </h1>
        <p className="text-muted-foreground mt-2">{note.title}</p>

        <div className="mt-6 rounded-lg border border-border overflow-hidden">
          <iframe
            title={`${note.subject} PDF Preview`}
            src={note.previewUrl}
            className="h-[75vh] w-full"
          />
        </div>
      </div>
    </main>
  );
}
