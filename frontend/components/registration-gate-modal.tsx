'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, LogIn } from 'lucide-react';

interface RegistrationGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationGateModal({ isOpen, onClose }: RegistrationGateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Join PadhnaJaam</h2>
          <p className="text-muted-foreground">Create an account to download and share notes</p>
        </div>

        {/* Content */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
          <p className="text-sm font-semibold text-foreground">Benefits of signing up:</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold mt-1">•</span>
              <span>Download all study notes and resources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold mt-1">•</span>
              <span>Share your own notes with the community</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold mt-1">•</span>
              <span>Join discussions and ask questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary font-bold mt-1">•</span>
              <span>Track your learning progress</span>
            </li>
          </ul>
        </div>

        {/* Sign Up Button */}
        <Link href="/auth" className="w-full block" onClick={onClose}>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-11 font-semibold">
            <Mail className="w-5 h-5 mr-2" />
            Sign Up with Email
          </Button>
        </Link>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Already have an account?</p>
          <Link href="/auth" onClick={onClose}>
            <Button variant="outline" className="w-full border-border text-foreground h-11">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
