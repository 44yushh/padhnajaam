import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();
  const { data: note } = await supabase
    .from('documents')
    .select('id, title, content, file_url, category, semester, university, faculty, program, subject, created_at')
    .eq('slug', slug)
    .single();

  if (!note) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">
          {note.category} · {new Date(note.created_at).toLocaleDateString()}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">{note.title}</h1>
        <p className="text-sm text-muted-foreground mt-3">
          {note.university} · {note.faculty} · {note.program} · {note.subject} · Semester {note.semester}
        </p>

        <div className="mt-8 rounded-lg border bg-card p-5 sm:p-8">
          <div
            className="space-y-4 leading-7 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-base [&_img]:rounded-md [&_img]:my-5"
            dangerouslySetInnerHTML={{ __html: note.content || '<p>No note content available.</p>' }}
          />
        </div>

        {note.file_url && (
          <div className="mt-6">
            <a
              href={note.file_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
            >
              Download PDF Version
            </a>
          </div>
        )}

        <Link href="/notes" className="inline-block mt-6 text-secondary hover:underline">
          Back to all notes
        </Link>
      </article>
    </main>
  );
}
