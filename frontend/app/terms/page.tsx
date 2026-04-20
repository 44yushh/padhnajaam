import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <h1 className="text-3xl font-bold text-foreground">PadhnaJaam Terms of Use</h1>

          <div>
            <h2 className="font-semibold text-foreground">Purpose</h2>
            <p className="text-muted-foreground mt-1">
              PadhnaJaam is a platform for sharing educational resources.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground">User Conduct</h2>
            <p className="text-muted-foreground mt-1">
              You agree to use the materials for personal study and not for commercial
              redistribution.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Accuracy</h2>
            <p className="text-muted-foreground mt-1">
              While we aim for quality, we are not responsible for errors in the notes or resources
              provided.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Account Termination</h2>
            <p className="text-muted-foreground mt-1">
              We reserve the right to remove access for users who violate these terms.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
