import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { type StructureStore, type UniversityItem } from '@/lib/structure-types';

const structureFilePath = path.join(process.cwd(), 'data', 'structure.json');
const notesFilePath = path.join(process.cwd(), 'data', 'notes.json');

type StructureAction = 'createUniversity' | 'createFaculty' | 'createProgram';
type DeleteLevel = 'university' | 'faculty' | 'program';

async function readStructure(): Promise<StructureStore> {
  const content = await fs.readFile(structureFilePath, 'utf-8');
  return JSON.parse(content) as StructureStore;
}

async function writeStructure(store: StructureStore): Promise<void> {
  await fs.writeFile(structureFilePath, JSON.stringify(store, null, 2), 'utf-8');
}

export async function GET() {
  const structure = await readStructure();
  return NextResponse.json({ structure });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: StructureAction;
    name?: string;
    logoUrl?: string;
    universityId?: string;
    facultyId?: string;
    semesters?: string[];
  };

  const structure = await readStructure();

  if (body.action === 'createUniversity') {
    if (!body.name) {
      return NextResponse.json({ error: 'University name is required' }, { status: 400 });
    }
    const university: UniversityItem = {
      id: `uni-${Date.now()}`,
      name: body.name,
      logoUrl: body.logoUrl || '',
      faculties: [],
    };
    structure.universities.push(university);
    await writeStructure(structure);
    return NextResponse.json({ structure });
  }

  if (body.action === 'createFaculty') {
    if (!body.universityId || !body.name) {
      return NextResponse.json({ error: 'universityId and faculty name are required' }, { status: 400 });
    }
    const university = structure.universities.find((item) => item.id === body.universityId);
    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }
    university.faculties.push({
      id: `fac-${Date.now()}`,
      name: body.name,
      programs: [],
    });
    await writeStructure(structure);
    return NextResponse.json({ structure });
  }

  if (body.action === 'createProgram') {
    if (!body.universityId || !body.facultyId || !body.name) {
      return NextResponse.json(
        { error: 'universityId, facultyId, and program name are required' },
        { status: 400 }
      );
    }
    const university = structure.universities.find((item) => item.id === body.universityId);
    const faculty = university?.faculties.find((item) => item.id === body.facultyId);
    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }
    faculty.programs.push({
      id: `prog-${Date.now()}`,
      name: body.name,
      semesters: body.semesters?.length ? body.semesters : ['1st', '2nd', '3rd', '4th'],
    });
    await writeStructure(structure);
    return NextResponse.json({ structure });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as {
    level?: DeleteLevel;
    universityId?: string;
    facultyId?: string;
    programId?: string;
  };

  const structure = await readStructure();
  const notesContent = await fs.readFile(notesFilePath, 'utf-8');
  const notes = JSON.parse(notesContent) as Array<{ programId?: string }>;

  if (body.level === 'university') {
    const target = structure.universities.find((item) => item.id === body.universityId);
    if (!target) return NextResponse.json({ error: 'University not found' }, { status: 404 });
    if (target.faculties.length > 0) {
      return NextResponse.json({ error: 'Cannot delete university with faculties' }, { status: 409 });
    }
    structure.universities = structure.universities.filter((item) => item.id !== body.universityId);
  } else if (body.level === 'faculty') {
    const university = structure.universities.find((item) => item.id === body.universityId);
    const faculty = university?.faculties.find((item) => item.id === body.facultyId);
    if (!faculty || !university) return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    if (faculty.programs.length > 0) {
      return NextResponse.json({ error: 'Cannot delete faculty with programs' }, { status: 409 });
    }
    university.faculties = university.faculties.filter((item) => item.id !== body.facultyId);
  } else if (body.level === 'program') {
    const university = structure.universities.find((item) => item.id === body.universityId);
    const faculty = university?.faculties.find((item) => item.id === body.facultyId);
    const program = faculty?.programs.find((item) => item.id === body.programId);
    if (!program || !faculty) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

    const attachedNotes = notes.filter((note) => note.programId === body.programId).length;
    if (attachedNotes > 0) {
      return NextResponse.json({ error: 'Cannot delete program with notes' }, { status: 409 });
    }
    faculty.programs = faculty.programs.filter((item) => item.id !== body.programId);
  } else {
    return NextResponse.json({ error: 'Invalid delete level' }, { status: 400 });
  }

  await writeStructure(structure);
  return NextResponse.json({ structure });
}
