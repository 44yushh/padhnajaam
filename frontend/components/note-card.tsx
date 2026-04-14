'use client';

import { Note } from '@/lib/types';
import { Eye, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NoteCardProps {
  note: Note;
  subjectName: string;
}

type NoteFile = Note['files'][number];

export default function NoteCard({ note, subjectName }: NoteCardProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-700';
      case 'image':
        return 'bg-blue-100 text-blue-700';
      case 'text':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'image':
        return 'IMG';
      case 'text':
        return 'TXT';
      default:
        return 'FILE';
    }
  };

  const getFileDisplay = (file: NoteFile) => {
    if (file.type === 'image') {
      return (
        <div className="w-full h-64 bg-muted rounded-lg overflow-hidden mb-4">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      );
    } else if (file.type === 'pdf') {
      return (
        <div className="w-full bg-muted rounded-lg p-8 text-center mb-4">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground mt-2">PDF document</p>
        </div>
      );
    } else if (file.type === 'text') {
      return (
        <div className="w-full bg-muted rounded-lg p-6 mb-4 font-mono text-sm text-foreground whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
          {file.content || 'Text content preview'}
        </div>
      );
    }
  };

  return (
    <>
      <div
        className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-card hover:bg-muted/50"
        onClick={() => setShowModal(true)}
      >
        {/* File Type Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            {note.files.map((file) => (
              <span
                key={file.id}
                className={`text-xs font-semibold px-2 py-1 rounded ${getFileTypeColor(file.type)}`}
              >
                {getFileTypeIcon(file.type)}
              </span>
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {subjectName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{note.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{note.description}</p>

        {/* View Button */}
        <div className="flex justify-end">
          <Button
            size="sm"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-foreground">{note.title}</h2>
                <p className="text-sm text-muted-foreground">{subjectName}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{note.description}</p>
              </div>

              {/* Files Display */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Content</h3>
                <div className="space-y-4">
                  {note.files.map((file, index) => (
                    <div key={file.id} className="rounded-lg border border-border p-3">
                      {getFileDisplay(file)}
                      <div className="text-sm text-muted-foreground flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-xs">{file.size} MB</p>
                        </div>
                        {file.type === 'pdf' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-secondary/40 text-secondary hover:bg-secondary/10"
                            onClick={() => {
                              setShowModal(false);
                              router.push(`/document-view?noteId=${note.id}&fileIndex=${index}`);
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Document View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded By */}
              <div className="text-sm border-t border-border pt-4">
                <p className="text-muted-foreground">Uploaded by</p>
                <p className="font-semibold text-foreground">{note.uploadedBy}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
