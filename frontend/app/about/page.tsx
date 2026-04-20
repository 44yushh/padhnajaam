import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { BookOpen, Target, Users, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              By Students, For Students.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              PadhnaJaam was born out of the frustration of a student who found a massive gap in how academic resources are shared—scattered, unorganized, and often inaccessible.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">The PadhnaJaam Mission</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  We are strategically penetrating the academic market to solve one core problem: <strong>Accessibility.</strong> 
                  We realized that while students have the drive to learn, the materials they need are often locked behind 
                  unorganized social media groups or outdated physical libraries.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our goal is to make quality education available to all by centralizing resources, 
                  clarifying learning paths, and fostering community-powered contribution. No student should 
                  have to struggle just to find a set of notes.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2 text-foreground">Market Focus</h3>
                  <p className="text-sm text-muted-foreground text-balance">Directly addressing the gap in organized digital academic resources.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                  <BookOpen className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2 text-foreground">Quality Content</h3>
                  <p className="text-sm text-muted-foreground text-balance">Curated notes specifically for University exams and PSC preparations.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                  <Users className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2 text-foreground">Community</h3>
                  <p className="text-sm text-muted-foreground text-balance">Built as a hub where students can contribute and help peers succeed.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                  <Mail className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2 text-foreground">Open Access</h3>
                  <p className="text-sm text-muted-foreground text-balance">Making resources available to everyone, everywhere in Nepal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Have questions or want to contribute?</h2>
            <p className="text-muted-foreground mb-8">
              Whether you are a student, a teacher, or just someone who wants to help, we would love to hear from you.
            </p>
            <a 
              href="mailto:aayushhhsahh@gmail.com" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90"
            >
              Get in Touch: aayushhhsahh@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}