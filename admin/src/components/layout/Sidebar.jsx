'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../context/SidebarContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Warehouse,
  Star,
  CreditCard,
  Settings,
  Leaf,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag,
  Percent,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/customers', icon: Users },
    // { label: 'Offers & Discounts', path: '/offers', icon: Tag },
    { label: 'Inventory & Stock', path: '/inventory', icon: Warehouse },
    { label: 'Reviews', path: '/reviews', icon: Star },
    { label: 'Payments & Invoices', path: '/payments', icon: CreditCard },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-icon flex-none">
          <Leaf size={22} className="text-[#F6F3EC]" />
        </div>
        {!isCollapsed && (
          <div className="sidebar-brand-text animate-fadeIn">
            <div className="sidebar-brand-title">KLN Ayurveda</div>
            <div className="sidebar-brand-sub flex items-center gap-1">
              <Sparkles size={10} className="text-[#C9A66B]" />
              <span>Admin Portal</span>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {!isCollapsed && <div className="nav-section-title">Core Management</div>}
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              title={isCollapsed ? item.label : undefined}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="flex-none" />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]" />
              )}
            </Link>
          );
        })}

        {!isCollapsed && <div className="nav-section-title" style={{ marginTop: '1.2rem' }}>Store Operations</div>}
        {navItems.slice(5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              title={isCollapsed ? item.label : undefined}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="flex-none" />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse / Expand Footer Toggle Button */}
      <div className="sidebar-footer">
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span></span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
