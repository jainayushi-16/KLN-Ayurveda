'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-body animate-page">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
