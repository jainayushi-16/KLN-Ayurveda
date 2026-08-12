'use client';

import React from 'react';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import AdminLayout from '../../components/layout/AdminLayout';

export default function DashboardGroupLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}
