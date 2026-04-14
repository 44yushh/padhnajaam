'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import { pastQuestions } from '@/lib/data';
import { useState } from 'react';

export default function PastQuestionsPage() {
  const [viewingPaper, setViewingPaper] = useState<string | null>(null);

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

        {/* Content */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pastQuestions.map((paper) => (
                <div key={paper.id} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingPaper(paper.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded">
                      {paper.files.length} FILE{paper.files.length !== 1 ? 'S' : ''}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">{paper.year}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{paper.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subject: <span className="font-medium">{paper.subject}</span>
                  </p>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingPaper(paper.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* View Modal */}
      {viewingPaper && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-foreground">{pastQuestions.find(p => p.id === viewingPaper)?.title}</h2>
                <p className="text-sm text-muted-foreground">{pastQuestions.find(p => p.id === viewingPaper)?.subject}</p>
              </div>
              <button
                onClick={() => setViewingPaper(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Exam Year</h3>
                <p className="text-sm text-muted-foreground">{pastQuestions.find(p => p.id === viewingPaper)?.year}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Papers</h3>
                <div className="space-y-2">
                  {pastQuestions.find(p => p.id === viewingPaper)?.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} MB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
