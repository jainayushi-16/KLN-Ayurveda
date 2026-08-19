'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from '../../context/SidebarContext';

const AdminLayout = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`app-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
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
