import { University, Note, CommunityPost, PastQuestion } from './types';

export const universities: University[] = [
  {
    id: 'uni-1',
    name: 'University of Karachi',
    faculties: [
      {
        id: 'fac-1-1',
        name: 'Faculty of Management & Social Sciences',
        universityId: 'uni-1',
        semesters: [
          {
            id: 'sem-1-1-1',
            name: 'Semester 1',
            facultyId: 'fac-1-1',
            subjects: [
              {
                id: 'subj-1',
                name: 'Business Fundamentals',
                semesterId: 'sem-1-1-1',
                notes: [],
              },
              {
                id: 'subj-2',
                name: 'Organizational Behavior',
                semesterId: 'sem-1-1-1',
                notes: [],
              },
              {
                id: 'subj-3',
                name: 'Principles of Management',
                semesterId: 'sem-1-1-1',
                notes: [],
              },
            ],
          },
          {
            id: 'sem-1-1-2',
            name: 'Semester 2',
            facultyId: 'fac-1-1',
            subjects: [
              {
                id: 'subj-4',
                name: 'Managerial Accounting',
                semesterId: 'sem-1-1-2',
                notes: [],
              },
              {
                id: 'subj-5',
                name: 'Business Communication',
                semesterId: 'sem-1-1-2',
                notes: [],
              },
            ],
          },
        ],
      },
      {
        id: 'fac-1-2',
        name: 'Faculty of Economics',
        universityId: 'uni-1',
        semesters: [
          {
            id: 'sem-1-2-1',
            name: 'Semester 1',
            facultyId: 'fac-1-2',
            subjects: [
              {
                id: 'subj-6',
                name: 'Microeconomics',
                semesterId: 'sem-1-2-1',
                notes: [],
              },
              {
                id: 'subj-7',
                name: 'Macroeconomics',
                semesterId: 'sem-1-2-1',
                notes: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'uni-2',
    name: 'COMSATS University',
    faculties: [
      {
        id: 'fac-2-1',
        name: 'Faculty of Business Administration',
        universityId: 'uni-2',
        semesters: [
          {
            id: 'sem-2-1-1',
            name: 'Semester 1',
            facultyId: 'fac-2-1',
            subjects: [
              {
                id: 'subj-8',
                name: 'Strategic Management',
                semesterId: 'sem-2-1-1',
                notes: [],
              },
              {
                id: 'subj-9',
                name: 'Corporate Finance',
                semesterId: 'sem-2-1-1',
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
    title: 'Porter Five Forces Analysis',
    description: 'Comprehensive guide to understanding competitive dynamics using Porter\'s Five Forces framework',
    subjectId: 'subj-1',
    files: [
      {
        id: 'file-1',
        name: 'porter-analysis.pdf',
        type: 'pdf',
        size: 2.5,
        uploadedAt: new Date('2024-03-15'),
        url: '#',
      },
      {
        id: 'file-2',
        name: 'case-studies.pdf',
        type: 'pdf',
        size: 1.8,
        uploadedAt: new Date('2024-03-15'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2024-03-15'),
    uploadedBy: 'Ahmed Hassan',
  },
  {
    id: 'note-2',
    title: 'Team Dynamics & Conflict Resolution',
    description: 'Key concepts in managing team behavior, group dynamics, and resolving workplace conflicts',
    subjectId: 'subj-2',
    files: [
      {
        id: 'file-3',
        name: 'team-dynamics-notes.pdf',
        type: 'pdf',
        size: 3.2,
        uploadedAt: new Date('2024-03-10'),
        url: '#',
      },
      {
        id: 'file-4',
        name: 'conflict-resolution-diagram.png',
        type: 'image',
        size: 0.8,
        uploadedAt: new Date('2024-03-10'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2024-03-10'),
    uploadedBy: 'Fatima Khan',
  },
  {
    id: 'note-3',
    title: 'Management Functions Framework',
    description: 'Complete notes on planning, organizing, leading, and controlling in modern management',
    subjectId: 'subj-3',
    files: [
      {
        id: 'file-5',
        name: 'management-functions.pdf',
        type: 'pdf',
        size: 4.1,
        uploadedAt: new Date('2024-03-08'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2024-03-08'),
    uploadedBy: 'Ali Raza',
  },
  {
    id: 'note-4',
    title: 'Financial Statement Analysis',
    description: 'Step-by-step guide to analyzing balance sheets, income statements, and cash flow statements',
    subjectId: 'subj-4',
    files: [
      {
        id: 'file-6',
        name: 'financial-analysis-guide.pdf',
        type: 'pdf',
        size: 2.3,
        uploadedAt: new Date('2024-03-05'),
        url: '#',
      },
      {
        id: 'file-7',
        name: 'ratio-formulas.txt',
        type: 'text',
        size: 0.5,
        uploadedAt: new Date('2024-03-05'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2024-03-05'),
    uploadedBy: 'Sara Ahmed',
  },
];

export const pastQuestions: PastQuestion[] = [
  {
    id: 'pq-1',
    title: 'Business Fundamentals Final Exam 2023',
    subject: 'Business Fundamentals',
    year: 2023,
    files: [
      {
        id: 'file-8',
        name: 'business-final-2023.pdf',
        type: 'pdf',
        size: 1.2,
        uploadedAt: new Date('2024-01-15'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2024-01-15'),
  },
  {
    id: 'pq-2',
    title: 'Organizational Behavior Midterm 2024',
    subject: 'Organizational Behavior',
    year: 2024,
    files: [
      {
        id: 'file-9',
        name: 'org-behavior-midterm-2024.pdf',
        type: 'pdf',
        size: 1.8,
        uploadedAt: new Date('2024-02-20'),
        url: '#',
      },
    ],
    uploadedAt: new Date('2024-02-20'),
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Ahmed Hassan',
    title: 'Best approach to understanding Strategic Management concepts?',
    content: 'I am struggling with Porter\'s Five Forces and SWOT analysis. Can anyone recommend good resources or study techniques?',
    type: 'question',
    upvotes: 24,
    replies: 12,
    uploadedAt: new Date('2024-03-12'),
  },
  {
    id: 'post-2',
    author: 'Fatima Khan',
    title: 'Study Group for Organizational Behavior',
    content: 'Starting a study group for organizational behavior. Meeting every Thursday at 4 PM at library. All management students welcome!',
    type: 'discussion',
    upvotes: 18,
    replies: 8,
    uploadedAt: new Date('2024-03-13'),
  },
  {
    id: 'post-3',
    author: 'Ali Raza',
    title: 'Great resource: Khan Academy Business Course',
    content: 'Found this amazing free business course that covers most of our fundamentals. Highly recommend for quick revision!',
    type: 'resource',
    upvotes: 45,
    replies: 22,
    uploadedAt: new Date('2024-03-10'),
  },
];
