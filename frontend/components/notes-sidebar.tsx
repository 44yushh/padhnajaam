'use client';

import { University } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface NotesSidebarProps {
  universities: University[];
  filters: {
    universityId?: string;
    facultyId?: string;
    semesterId?: string;
    subjectId?: string;
  };
  expandedItems: Set<string>;
  onUniversityClick: (id: string) => void;
  onFacultyClick: (id: string) => void;
  onSemesterClick: (id: string) => void;
  onSubjectClick: (id: string) => void;
  toggleExpanded: (id: string) => void;
}

export default function NotesSidebar({
  universities,
  filters,
  expandedItems,
  onUniversityClick,
  onFacultyClick,
  onSemesterClick,
  onSubjectClick,
  toggleExpanded,
}: NotesSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 border-r border-border bg-muted/30 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 space-y-1">
        {/* Universities */}
        {universities.map((university) => (
          <div key={university.id}>
            {/* University Item */}
            <button
              onClick={() => {
                onUniversityClick(university.id);
                toggleExpanded(`uni-${university.id}`);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                filters.universityId === university.id
                  ? 'bg-secondary/10 text-secondary font-semibold'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="text-sm">{university.name}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedItems.has(`uni-${university.id}`) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Faculties */}
            {expandedItems.has(`uni-${university.id}`) && (
              <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
                {university.faculties.map((faculty) => (
                  <div key={faculty.id}>
                    <button
                      onClick={() => {
                        onFacultyClick(faculty.id);
                        toggleExpanded(`fac-${faculty.id}`);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                        filters.facultyId === faculty.id
                          ? 'bg-secondary/10 text-secondary font-semibold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{faculty.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.has(`fac-${faculty.id}`) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Semesters */}
                    {expandedItems.has(`fac-${faculty.id}`) && (
                      <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
                        {faculty.semesters.map((semester) => (
                          <div key={semester.id}>
                            <button
                              onClick={() => {
                                onSemesterClick(semester.id);
                                toggleExpanded(`sem-${semester.id}`);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                                filters.semesterId === semester.id
                                  ? 'bg-secondary/10 text-secondary font-semibold'
                                  : 'text-foreground hover:bg-muted'
                              }`}
                            >
                              <span>{semester.name}</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedItems.has(`sem-${semester.id}`) ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {/* Subjects */}
                            {expandedItems.has(`sem-${semester.id}`) && (
                              <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
                                {semester.subjects.map((subject) => (
                                  <button
                                    key={subject.id}
                                    onClick={() => onSubjectClick(subject.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                      filters.subjectId === subject.id
                                        ? 'bg-secondary/10 text-secondary font-semibold'
                                        : 'text-foreground hover:bg-muted'
                                    }`}
                                  >
                                    {subject.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
