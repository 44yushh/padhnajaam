import { promises as fs } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { type StoredNote } from '@/lib/structure-types';

async function readNotes(): Promise<StoredNote[]> {
  const notesPath = path.join(process.cwd(), 'data', 'notes.json');
  const content = await fs.readFile(notesPath, 'utf-8');
  return JSON.parse(content) as StoredNote[];
}

export default async function NotesIndexPage() {
  const notes = await readNotes();

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

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-heading font-bold text-foreground">Available Notes</h1>
        <div className="mt-6 space-y-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} className="block rounded-lg border border-border p-4">
              <p className="font-semibold">{note.title}</p>
              <p className="text-sm text-muted-foreground">
                {note.subject} | {note.semester} semester
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
