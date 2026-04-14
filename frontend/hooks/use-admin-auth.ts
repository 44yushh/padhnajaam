import { useState, useEffect } from 'react';

// In a real app, this would verify actual authentication
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin (in real app, verify with backend)
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    setIsLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  return { isAdmin, isLoading, login, logout };
}
