'use client';

import { Note, University } from '@/lib/types';
import NoteCard from './note-card';
import { useMemo } from 'react';

interface NotesGridProps {
  universities: University[];
  filters: {
    universityId?: string;
    facultyId?: string;
    semesterId?: string;
    subjectId?: string;
  };
  notes: Note[];
}

export default function NotesGrid({ universities, filters, notes }: NotesGridProps) {
  // Get filtered notes
  const filteredNotes = useMemo(() => {
    if (filters.subjectId) {
      return notes.filter((note) => note.subjectId === filters.subjectId);
    }
    return notes;
  }, [filters.subjectId, notes]);

  // Get subject name from university data
  const getSubjectName = (subjectId: string): string => {
    for (const university of universities) {
      for (const faculty of university.faculties) {
        for (const semester of faculty.semesters) {
          for (const subject of semester.subjects) {
            if (subject.id === subjectId) {
              return subject.name;
            }
          }
        }
      }
    }
    return 'Unknown Subject';
  };

  if (filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No notes found</p>
          <p className="text-muted-foreground">
            {filters.subjectId
              ? 'Try selecting a different subject'
              : 'Select a subject from the left sidebar to view notes'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {filteredNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          subjectName={getSubjectName(note.subjectId)}
        />
      ))}
    </div>
  );
}
