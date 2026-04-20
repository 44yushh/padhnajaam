import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <h1 className="text-3xl font-bold text-foreground">PadhnaJaam Privacy Policy</h1>

          <div>
            <h2 className="font-semibold text-foreground">Data We Collect</h2>
            <p className="text-muted-foreground mt-1">
              We collect your name, email, and profile picture via Google or Facebook to create
              your account.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Usage</h2>
            <p className="text-muted-foreground mt-1">
              This data is used only to manage your access to the resource library. We do not share
              or sell your information.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Security</h2>
            <p className="text-muted-foreground mt-1">We use Supabase for secure data storage.</p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Contact</h2>
            <p className="text-muted-foreground mt-1">
              For any privacy concerns, email{' '}
              <a href="mailto:aayushhhsahh@gmail.com" className="text-secondary hover:underline">
                aayushhhsahh@gmail.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
