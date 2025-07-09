"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Sidebar from '@/app/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showFullLayout, setShowFullLayout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut) {
      router.push('/admin/login');
    } else if (isAuthenticated) {
      setCheckingAuth(false);
      setTimeout(() => {
        setShowFullLayout(true);
      }, 500);
      
    }
  }, [isAuthenticated, router, isLoggingOut]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  if (!showFullLayout || isLoggingOut) {
    return <main className="flex-1 p-6">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-lg px-4 py-2 transition duration-300 ease-in-out"
            >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M9 12h12m0 0l-3-3m3 3l-3 3"
              />
              </svg>
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">
          
          {children}</main>
      </div>
    </div>
  );
}
