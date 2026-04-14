import { useState } from 'react';

export interface FilterState {
  universityId?: string;
  facultyId?: string;
  semesterId?: string;
  subjectId?: string;
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({});
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const setUniversity = (id: string | undefined) => {
    setFilters({
      universityId: id,
      facultyId: undefined,
      semesterId: undefined,
      subjectId: undefined,
    });
    if (id) {
      setExpandedItems((prev) => new Set(prev).add(`uni-${id}`));
    }
  };

  const setFaculty = (id: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      facultyId: id,
      semesterId: undefined,
      subjectId: undefined,
    }));
    if (id) {
      setExpandedItems((prev) => new Set(prev).add(`fac-${id}`));
    }
  };

  const setSemester = (id: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      semesterId: id,
      subjectId: undefined,
    }));
    if (id) {
      setExpandedItems((prev) => new Set(prev).add(`sem-${id}`));
    }
  };

  const setSubject = (id: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      subjectId: id,
    }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return {
    filters,
    expandedItems,
    setUniversity,
    setFaculty,
    setSemester,
    setSubject,
    toggleExpanded,
  };
}
