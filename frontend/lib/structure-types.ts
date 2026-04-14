export interface ProgramItem {
  id: string;
  name: string;
  semesters: string[];
}

export interface FacultyItem {
  id: string;
  name: string;
  programs: ProgramItem[];
}

export interface UniversityItem {
  id: string;
  name: string;
  logoUrl: string;
  faculties: FacultyItem[];
}

export interface StructureStore {
  universities: UniversityItem[];
}

export interface StoredNote {
  id: string;
  title: string;
  subject: string;
  semester: string;
  previewUrl: string;
  universityId?: string;
  facultyId?: string;
  programId?: string;
}
