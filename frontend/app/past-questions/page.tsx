import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function PastQuestionsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('documents')
    .select('id, title, file_url, subject, semester, created_at')
    .eq('category', 'Past Paper')
    .order('created_at', { ascending: false });
  const papers = data ?? [];

  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted to-background py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Past Examination Papers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse previous years examination papers across all courses to understand exam patterns and practice.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-3">
              {papers.map((paper) => (
                <a key={paper.id} href={paper.file_url || '#'} target="_blank" rel="noreferrer" className="block rounded-xl border border-border bg-card p-5 hover:bg-muted/30">
                  <h2 className="font-semibold">{paper.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {paper.subject} · Semester {paper.semester} · {new Date(paper.created_at).toLocaleDateString()}
                  </p>
                </a>
              ))}
              {papers.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                  No past question papers uploaded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
