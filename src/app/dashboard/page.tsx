'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import UploadSection from './components/UploadSection';
import DocumentList from './components/DocumentList';
import { useDashboardData } from '@/hooks/useDashboardData';
import { UserDocument } from '@/types'; // adjust path if needed

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { documents, loading: dataLoading, error,} = useDashboardData();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes (e.g., after magic link login)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
   //   if (event === 'SIGNED_IN') {
        refresh(); // Refresh data when signed in
      }
    });

   // return () => {
      listener.subscription.unsubscribe();
    };
 // }, [refresh]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You must be logged in to view the dashboard.</p>
        <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Bible LMS Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.email}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Upload Document</h2>
         // <UploadSection onUploadSuccess={refresh} />
        </section>

        {/* Document List */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Documents</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
       //   <DocumentList documents={documents as UserDocument[]} onDeleteSuccess={refresh} />
        </section>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/';
          }}
          className="text-blue-600 hover:underline"
        >
          Sign Out
        </button>
      </footer>
    </div>
  );
}