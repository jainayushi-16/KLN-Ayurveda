'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { LogOut, Leaf, PanelLeftClose, Menu } from 'lucide-react';
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
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const pageTitle = titlesMap[pathname] || 'Admin Dashboard';
  const userInitial = adminUser?.firstName ? adminUser.firstName[0].toUpperCase() : 'A';

  return (
    <header className="top-header">
      <div className="page-title-area flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white transition-all border border-[#2F5D34]/20 shadow-sm cursor-pointer"
          title={isCollapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
        >
          {isCollapsed ? (
            <>
              <Menu size={18} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menu</span>
            </>
          ) : (
            <>
              <PanelLeftClose size={18} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Collapse</span>
            </>
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-[#2F5D34]/10 text-[#2F5D34] flex items-center justify-center animate-bounce">
          <Leaf size={18} />
        </div>
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
