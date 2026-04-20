import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function DeletionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <h1 className="text-3xl font-bold text-foreground">Data Deletion Instructions</h1>

          <p className="text-muted-foreground">
            You can request to have your data deleted from PadhnaJaam at any time:
          </p>

          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>
              Send an email to{' '}
              <a href="mailto:aayushhhsahh@gmail.com" className="text-secondary hover:underline">
                aayushhhsahh@gmail.com
              </a>
              .
            </li>
            <li>Use the subject line: &quot;Data Deletion Request - [Your Name]&quot;.</li>
            <li>
              We will remove your account record from our Supabase database within 7 days.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Note: You can also manually remove PadhnaJaam&apos;s permissions via your Google or
            Facebook account security settings.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
