'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Inventory & Stock', path: '/inventory', icon: Warehouse },
    { label: 'Reviews', path: '/reviews', icon: Star },
    { label: 'Payments & Invoices', path: '/payments', icon: CreditCard },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <Leaf size={22} className="text-[#F6F3EC]" />
        </div>
        <div>
          <div className="sidebar-brand-title">KLN Ayurveda</div>
          <div className="sidebar-brand-sub flex items-center gap-1">
            <Sparkles size={10} className="text-[#C9A66B]" />
            <span>Admin Portal</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Management</div>
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]" />
              )}
            </Link>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '1.2rem' }}>Store Operations</div>
        {navItems.slice(5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
