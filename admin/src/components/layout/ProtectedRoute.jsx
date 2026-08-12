'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { adminUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!adminUser || adminUser.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [adminUser, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1310', color: '#d4af37' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>KLN Ayurveda Admin</div>
          <div style={{ fontSize: '0.85rem', color: '#94a89f' }}>Authenticating session...</div>
        </div>
      </div>
    );
  }

  if (!adminUser || adminUser.role !== 'ADMIN') {
    return null;
  }

  return children;
};

export default ProtectedRoute;
