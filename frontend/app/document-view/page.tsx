'use client';

import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { notes } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Expand, Lock, BookOpen } from 'lucide-react';

const DEFAULT_PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

export default function DocumentViewPage() {
  const searchParams = useSearchParams();
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  const noteId = searchParams.get('noteId');
  const requestedFileIndex = Number(searchParams.get('fileIndex') || 0);

  const selected = useMemo(() => {
    const note = notes.find((item) => item.id === noteId) || notes[0];
    const pdfFiles = note.files.filter((file) => file.type === 'pdf');
    const file = pdfFiles[requestedFileIndex] || pdfFiles[0];
    return { note, file };
  }, [noteId, requestedFileIndex]);

  const chapters = useMemo(
    () => [
      { id: 'ch-1', title: 'Chapter 1: Introduction', pages: '1-2', locked: false },
      { id: 'ch-2', title: 'Chapter 2: Core Concepts', pages: '3-7', locked: !hasJoined },
      { id: 'ch-3', title: 'Chapter 3: Case Applications', pages: '8-12', locked: !hasJoined },
      { id: 'ch-4', title: 'Chapter 4: Framework Practice', pages: '13-18', locked: !hasJoined },
    ],
    [hasJoined]
  );

  const pdfUrl = selected.file?.url && selected.file.url !== '#' ? selected.file.url : DEFAULT_PDF_URL;

  const handleFullscreen = async () => {
    if (!viewerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await viewerRef.current.requestFullscreen();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{selected.note.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Document View mode active. First 2 pages are open for all students.
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5">
            <aside className="rounded-lg border border-border bg-card p-4 h-fit">
              <h2 className="font-semibold text-foreground mb-3">Chapter Navigation</h2>
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className="w-full text-left rounded-md border border-border px-3 py-2 hover:bg-muted/70 transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{chapter.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" />
                      Pages {chapter.pages}
                      {chapter.locked && (
                        <span className="inline-flex items-center gap-1 text-secondary">
                          <Lock className="w-3 h-3" />
                          Join Free
                        </span>
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  {selected.file?.name || 'Selected PDF'} {hasJoined ? '(Full Access)' : '(Preview: 2 Pages)'}
                </p>
                <Button
                  onClick={handleFullscreen}
                  variant="outline"
                  className="border-secondary/40 text-secondary hover:bg-secondary/10"
                >
                  <Expand className="w-4 h-4 mr-2" />
                  View Fullscreen
                </Button>
              </div>

              <div ref={viewerRef} className="relative rounded-lg overflow-hidden border border-border bg-black/5">
                <iframe title="PDF Document Viewer" src={pdfUrl} className="w-full h-[78vh]" />

                {!hasJoined && (
                  <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-card via-card/95 to-card/25 flex items-end">
                    <div className="w-full p-5 border-t border-border bg-card/95">
                      <p className="text-sm text-foreground font-medium">
                        Preview unlocked: pages 1-2. Join free to continue reading all chapters.
                      </p>
                      <Button
                        className="mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        onClick={() => setHasJoined(true)}
                      >
                        Join Free
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
