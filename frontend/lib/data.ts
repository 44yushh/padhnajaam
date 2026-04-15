import { University, Note, CommunityPost, PastQuestion } from './types';

export const universities: University[] = [
  {
    id: 'uni-tu',
    name: 'Tribhuvan University',
    faculties: [
      {
        id: 'fac-mgmt',
        name: 'Faculty of Management',
        universityId: 'uni-tu',
        semesters: [
          {
            id: 'sem-3',
            name: 'BBA - 3rd Semester',
            facultyId: 'fac-mgmt',
            subjects: [
              {
                id: 'subj-fin-mgmt',
                name: 'Financial Management',
                semesterId: 'sem-3',
                notes: [],
              },
              {
                id: 'subj-cost-acc',
                name: 'Cost & Management Accounting',
                semesterId: 'sem-3',
                notes: [],
              },
              {
                id: 'subj-stats',
                name: 'Business Statistics',
                semesterId: 'sem-3',
                notes: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const notes: Note[] = [
  {
    id: 'note-1',
    title: 'Financial Management Core Concepts',
    description: 'Detailed analysis of Time Value of Money and Capital Budgeting for TU BBA 3rd Sem.',
    subjectId: 'subj-fin-mgmt',
    files: [
      {
        id: 'file-1',
        name: 'financial-mgmt-guide.pdf',
        type: 'pdf',
        size: 2.5,
        uploadedAt: new Date('2026-04-15'),
        url: '#',
      }
    ],
    uploadedAt: new Date('2026-04-15'),
    uploadedBy: 'Admin',
  },
  {
    id: 'note-2',
    title: 'Cost Accounting: Material & Labor',
    description: 'Essential notes for Cost Accounting focusing on EOQ and Labor Costing formulas.',
    subjectId: 'subj-cost-acc',
    files: [
      {
        id: 'file-2',
        name: 'cost-accounting-notes.pdf',
        type: 'pdf',
        size: 3.2,
        uploadedAt: new Date('2026-04-14'),
        url: '#',
      }
    ],
    uploadedAt: new Date('2026-04-14'),
    uploadedBy: 'Admin',
  },
];

export const pastQuestions: PastQuestion[] = [
  {
    id: 'pq-1',
    title: 'Financial Management Board Exam 2023',
    subject: 'Financial Management',
    year: 2023,
    files: [
      {
        id: 'file-8',
        name: 'tu-fin-mgmt-2023.pdf',
        type: 'pdf',
        size: 1.2,
        uploadedAt: new Date('2026-01-15'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2026-01-15'),
  },
  {
    id: 'pq-2',
    title: 'Business Statistics Past Paper 2022',
    subject: 'Business Statistics',
    year: 2022,
    files: [
      {
        id: 'file-9',
        name: 'tu-stats-2022.pdf',
        type: 'pdf',
        size: 1.8,
        uploadedAt: new Date('2026-02-20'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2026-02-20'),
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Admin',
    title: 'Welcome to PadhnaJaam!',
    content: 'The central hub for TU Management students. Find your 3rd-semester notes and past papers here.',
    type: 'discussion',
    upvotes: 10,
    replies: 0,
    uploadedAt: new Date('2026-04-15'),
  },
];