// app/admin/page.tsx
"use client";

import { useAuth } from '@/app/contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6">Welcome, {user}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Total Products</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹1,245,650</p>
        </div>
      </div> */}
    </div>
  );
}