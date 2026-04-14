import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted to-background py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              About PadhnaJaam
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering students through knowledge sharing and collaborative learning.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Mission */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                PadhnaJaam is dedicated to democratizing education by creating a centralized platform where students can
                easily access, share, and discover quality study materials. We believe that collaborative learning and
                knowledge sharing are key to academic success.
              </p>
            </div>

            {/* Vision */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a world where every student has access to comprehensive, well-organized educational resources
                regardless of their background or financial situation. By fostering a community of learners, we aim to make
                quality education more accessible and affordable.
              </p>
            </div>

            {/* What We Offer */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Comprehensive Notes',
                    description: 'Access detailed study notes from multiple universities, faculties, and subjects.',
                  },
                  {
                    title: 'Past Question Papers',
                    description: 'Prepare for exams with previous years question papers organized by year and subject.',
                  },
                  {
                    title: 'Community Forum',
                    description: 'Connect with fellow students, ask questions, and share learning resources.',
                  },
                  {
                    title: 'Easy Search & Filter',
                    description: 'Find exactly what you need with our intuitive search and filtering system.',
                  },
                ].map((item, index) => (
                  <div key={index} className="border border-border rounded-lg p-6 bg-card">
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Team</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                PadhnaJaam is built by passionate educators and developers committed to improving the educational
                experience for students worldwide. We are constantly working to expand our platform and add new features
                based on user feedback.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
