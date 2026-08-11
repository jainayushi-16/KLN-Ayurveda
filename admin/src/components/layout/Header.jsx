'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const titlesMap = {
  '/': 'Dashboard Overview',
  '/products': 'Product Management',
  '/categories': 'Category Management',
  '/orders': 'Order Management',
  '/customers': 'Customer Directory',
  '/inventory': 'Inventory & Stock Control',
  '/reviews': 'Review Moderation',
  '/payments': 'Payment & Invoice History',
  '/settings': 'Admin Settings & Profile',
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const pageTitle = titlesMap[pathname] || 'Admin Dashboard';
  const userInitial = adminUser?.firstName ? adminUser.firstName[0].toUpperCase() : 'A';

  return (
    <header className="top-header">
      <div className="page-title-area">
        <h2>{pageTitle}</h2>
      </div>

      <div className="header-user-bar">
        <div className="user-badge">
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info-text">
            <div className="user-name">
              {adminUser?.firstName || 'Admin'} {adminUser?.lastName || ''}
            </div>
            <div className="user-role">System Administrator</div>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout} title="Log out">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
