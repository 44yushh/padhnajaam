import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PastQuestionsPage() {
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
            <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-8 text-center">
              <h2 className="mt-2 text-3xl font-heading font-bold text-foreground">Coming Soon</h2>
              <p className="mt-3 text-muted-foreground">
                The PadhnaJaam Library is coming soon. Want to earn rewards? Contribute your 3rd Sem BBA Finance notes today!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
