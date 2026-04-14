import { mockNotes } from '@/lib/mock-notes-store';

interface NoteViewerPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteViewerPage({ params }: NoteViewerPageProps) {
  if (mockNotes.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-xs uppercase tracking-wide text-secondary font-semibold">Contribute & Earn</p>
          <h1 className="mt-2 text-3xl font-heading font-bold text-foreground">Coming Soon</h1>
          <p className="mt-3 text-muted-foreground">
            No notes here yet! Be the first to contribute for your semester and earn PadhnaJaam rewards.
          </p>
        </div>
      </main>
    );
  }

  const { id } = await params;
  const note = mockNotes.find((item) => item.id === id);

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
