'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CircleUserRound, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarLabel, setAvatarLabel] = useState('U');

  const navItems = [
    { label: 'Notes', href: '/' },
    { label: 'Past Questions', href: '/past-questions' },
    { label: 'Community', href: '/community' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const hasSession = Boolean(session?.user);
      setIsLoggedIn(hasSession);
      if (session?.user?.email) {
        setAvatarLabel(session.user.email.charAt(0).toUpperCase());
      }
    };
    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasSession = Boolean(session?.user);
      setIsLoggedIn(hasSession);
      setAvatarLabel(session?.user?.email?.charAt(0).toUpperCase() ?? 'U');
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">PJ</span>
            </div>
            <span className="font-bold text-lg text-primary hidden sm:inline">PadhnaJaam</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-secondary transition-colors rounded-md hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/auth" aria-label="User account" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 hover:bg-muted">
                <CircleUserRound className="h-5 w-5 text-foreground" />
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {avatarLabel}
                </span>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="border-border text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-secondary transition-colors rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {isLoggedIn ? (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-border text-foreground">
                      Account
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-border text-foreground">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
