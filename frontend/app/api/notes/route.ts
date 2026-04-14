import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { type StoredNote } from '@/lib/structure-types';

const notesFilePath = path.join(process.cwd(), 'data', 'notes.json');

async function readNotes(): Promise<StoredNote[]> {
  const content = await fs.readFile(notesFilePath, 'utf-8');
  return JSON.parse(content) as StoredNote[];
}

async function writeNotes(notes: StoredNote[]): Promise<void> {
  await fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), 'utf-8');
}

export async function GET() {
  const notes = await readNotes();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<StoredNote>;

  if (!body.title || !body.subject || !body.semester || !body.previewUrl) {
    return NextResponse.json(
      { error: 'title, subject, semester, and previewUrl are required' },
      { status: 400 }
    );
  }

  const note: StoredNote = {
    id: body.id || `note-${Date.now()}`,
    title: body.title,
    subject: body.subject,
    semester: body.semester,
    previewUrl: body.previewUrl,
    universityId: body.universityId,
    facultyId: body.facultyId,
    programId: body.programId,
  };

  const notes = await readNotes();
  notes.unshift(note);
  await writeNotes(notes);
  return NextResponse.json({ note }, { status: 201 });
}
