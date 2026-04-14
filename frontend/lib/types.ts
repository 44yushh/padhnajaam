export type FileType = 'pdf' | 'image' | 'text';

export interface File {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedAt: Date;
  url: string;
  content?: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  files: File[];
  subjectId: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Subject {
  id: string;
  name: string;
  semesterId: string;
  notes: Note[];
}

export interface Semester {
  id: string;
  name: string;
  facultyId: string;
  subjects: Subject[];
}

export interface Faculty {
  id: string;
  name: string;
  universityId: string;
  semesters: Semester[];
}

export interface University {
  id: string;
  name: string;
  faculties: Faculty[];
}

export interface PastQuestion {
  id: string;
  title: string;
  subject: string;
  year: number;
  files: File[];
  uploadedAt: Date;
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  type: 'discussion' | 'resource' | 'question';
  upvotes: number;
  replies: number;
  uploadedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  avatar?: string;
  isAdmin?: boolean;
}
