'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import NotesSidebar from '@/components/notes-sidebar';
import NotesGrid from '@/components/notes-grid';
import { useFilters } from '@/hooks/use-filters';
import { universities, notes } from '@/lib/data';
import { Search } from 'lucide-react';

export default function Home() {
  const { filters, expandedItems, setUniversity, setFaculty, setSemester, setSubject, toggleExpanded } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted to-background py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                Your Study Hub
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access comprehensive study notes, case studies, and resources shared by students across universities and faculties.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses, subjects, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <NotesSidebar
            universities={universities}
            filters={filters}
            expandedItems={expandedItems}
            onUniversityClick={setUniversity}
            onFacultyClick={setFaculty}
            onSemesterClick={setSemester}
            onSubjectClick={setSubject}
            toggleExpanded={toggleExpanded}
          />

          {/* Notes Grid */}
          <div className="flex-1 p-6 sm:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              {(filters.universityId || filters.facultyId || filters.semesterId || filters.subjectId) && (
                <div className="mb-6 text-sm text-muted-foreground">
                  <span>Notes</span>
                  {filters.universityId && (
                    <>
                      <span className="mx-2">›</span>
                      <span>
                        {universities.find((u) => u.id === filters.universityId)?.name}
                      </span>
                    </>
                  )}
                  {filters.facultyId && (
                    <>
                      <span className="mx-2">›</span>
                      <span>
                        {universities
                          .find((u) => u.id === filters.universityId)
                          ?.faculties.find((f) => f.id === filters.facultyId)?.name}
                      </span>
                    </>
                  )}
                  {filters.semesterId && (
                    <>
                      <span className="mx-2">›</span>
                      <span>
                        {universities
                          .find((u) => u.id === filters.universityId)
                          ?.faculties.find((f) => f.id === filters.facultyId)
                          ?.semesters.find((s) => s.id === filters.semesterId)?.name}
                      </span>
                    </>
                  )}
                  {filters.subjectId && (
                    <>
                      <span className="mx-2">›</span>
                      <span>
                        {universities
                          .find((u) => u.id === filters.universityId)
                          ?.faculties.find((f) => f.id === filters.facultyId)
                          ?.semesters.find((s) => s.id === filters.semesterId)
                          ?.subjects.find((s) => s.id === filters.subjectId)?.name}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Grid Title */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {filters.subjectId
                    ? 'Subject Notes'
                    : filters.semesterId
                    ? 'Semester Notes'
                    : filters.facultyId
                    ? 'Faculty Notes'
                    : filters.universityId
                    ? 'University Notes'
                    : 'All Notes'}
                </h2>
              </div>

              {/* Notes Grid */}
              <NotesGrid universities={universities} filters={filters} notes={notes} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
