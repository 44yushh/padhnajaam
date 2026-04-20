import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function Home() {
  const supabase = createSupabaseServerClient();

  // Fetch recent documents for the list
  const { data } = await supabase
    .from('documents')
    .select('id, title, slug, category, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  const documents = data ?? [];

  // ✅ FIXED: count from full table, not just the 10 fetched above
  const { count: notesCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'note');

  const { count: pastQuestionsCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'past_paper');

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted to-background py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                Your Study Hub
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time notes, past questions, and updates from the PadhnaJaam community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-3xl font-bold mt-2">{notesCount ?? 0}</p>
              </div>
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm text-muted-foreground">Past Questions</p>
                <p className="text-3xl font-bold mt-2">{pastQuestionsCount ?? 0}</p>
              </div>
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm text-muted-foreground">Community</p>
                <p className="text-3xl font-bold mt-2">Live</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Uploads</h2>
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Link key={doc.id} href={doc.slug ? `/notes/${doc.slug}` : '/notes'} className="border rounded-lg p-4 bg-card hover:bg-muted/40 transition-colors">
                <p className="font-semibold">{doc.title}</p>
                <p className="text-sm text-muted-foreground">
                  {doc.category === 'note' ? 'Study Note' : doc.category === 'past_paper' ? 'Past Question' : doc.category} · {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
            {documents.length === 0 && (
              <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-8 text-center">
                <h3 className="mt-2 text-3xl font-heading font-bold text-foreground">Coming Soon</h3>
                <p className="mt-3 text-muted-foreground">
                  The PadhnaJaam Library is coming soon. Want to earn rewards? Contribute your notes today.
                </p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Link href="/notes" className="text-secondary hover:underline font-medium">
              Browse all notes
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}