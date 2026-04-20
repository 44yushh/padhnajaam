'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    setFormData({ name: '', email: '', university: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted to-background py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or feedback? We&apos;d love to hear from you. Send us a message anytime.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-foreground mb-2">
                        University (Optional)
                      </label>
                      <input
                        id="university"
                        name="university"
                        type="text"
                        value={formData.university}
                        onChange={handleChange}
                        placeholder="Your university name"
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-11 font-semibold">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Email */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-6 h-6 text-secondary" />
                    <h3 className="font-semibold text-foreground">Email</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">For general inquiries:</p>
                  <a
                    href="mailto:aayushhhsahh@gmail.com"
                    className="text-secondary hover:text-secondary/80 font-medium break-all"
                  >
                    aayushhhsahh@gmail.com
                  </a>
                </div>

                {/* Response Time */}
                <div className="bg-muted border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24-48 hours. Thank you for your patience!
                  </p>
                </div>

                {/* Suggest Notes */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Suggest a Note</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Have study materials you think should be on the platform?
                  </p>
                  <Button variant="outline" className="w-full border-border text-foreground">
                    Submit a Suggestion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
