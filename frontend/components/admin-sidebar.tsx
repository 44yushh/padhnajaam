'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Home,
  Upload,
  Layers3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onLogout: () => void;
}

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { id: 'upload', label: 'Upload Portal', href: '/admin/upload', icon: Upload },
  { id: 'manage', label: 'Management', href: '/admin/manage', icon: Layers3 },
];

export default function AdminSidebar({ activeTab, onLogout }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle admin menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen z-30 w-72 border-r border-[#1f3f64] bg-[#0f2743] transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[#1f3f64]">
            <h1 className="text-xl font-bold text-white">PadhnaJaam Admin</h1>
            <p className="text-xs text-slate-300 mt-1">Navy Console</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === item.id
                      ? 'bg-[#e05a3f] text-white font-semibold'
                      : 'text-slate-200 hover:bg-[#1a3558]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-[#1f3f64]">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full border-[#315985] bg-transparent text-slate-100 hover:bg-[#1a3558]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
