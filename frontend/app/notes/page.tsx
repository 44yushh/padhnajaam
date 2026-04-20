import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function NotesIndexPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('documents')
    .select('id, title, subject, semester, slug, category')
    .eq('category', 'note')
    .order('created_at', { ascending: false });
  const notes = data ?? [];

  if (notes.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
          <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-8 text-center">
            <h1 className="mt-2 text-3xl font-heading font-bold text-foreground">Coming Soon</h1>
            <p className="mt-3 text-muted-foreground">
              No notes have been published yet.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-heading font-bold text-foreground">Available Notes</h1>
          <div className="mt-6 space-y-3">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={note.slug ? `/notes/${note.slug}` : '/notes'}
                className="block rounded-lg border border-border p-4 bg-card hover:bg-muted/40 transition-colors"
              >
                <p className="font-semibold">{note.title}</p>
                <p className="text-sm text-muted-foreground">
                  {note.subject} | Semester {note.semester}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}