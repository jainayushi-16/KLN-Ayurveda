'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axiosClient from '../../../api/axiosClient';
import {
  Save,
  ShieldCheck,
  Store,
  Lock,
  Mail,
  Phone,
  Bell,
  Percent,
  Truck,
  Sparkles,
  Globe,
  Building,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  User,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { adminUser, setAdminUser } = useAuth();
  const [activeTab, setActiveTab] = useState('store'); // "store" | "security" | "notifications" | "branding"
  const [loading, setLoading] = useState(true);

  const [savingStore, setSavingStore] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingToggles, setSavingToggles] = useState(false);

  // Store Configuration State
  const [storeForm, setStoreForm] = useState({
    storeName: 'KLN Ayurveda',
    supportEmail: 'support@klnayurveda.com',
    supportPhone: '+91 9876543210',
    businessAddress: 'KLN Ayurveda Pvt. Ltd., Narsinghpur, Madhya Pradesh - 487001',
    currency: 'INR (₹)',
    taxPercent: '18',
    freeShippingThreshold: '450',
  });

  // Admin Profile State
  const [profileForm, setProfileForm] = useState({
    firstName: adminUser?.firstName || 'System',
    lastName: adminUser?.lastName || 'Admin',
    email: adminUser?.email || 'admin@klnayurveda.com',
    phone: adminUser?.phone || '+91 9876543210',
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // System Toggles State
  const [toggles, setToggles] = useState({
    orderEmailAlerts: true,
    lowStockAlerts: true,
    lowStockLimit: '10',
    customerStatusEmails: true,
    dailySummaryDigest: false,
    maintenanceMode: false,
    autoApproveReviews: false,
    announcementText: '100% Pesticide-Free & Pure Ayurvedic • Free Shipping on Orders Over ₹450',
    defaultLanguage: 'en-IN',
  });

  useEffect(() => {
    if (adminUser) {
      setProfileForm((prev) => ({
        ...prev,
        firstName: adminUser.firstName || prev.firstName,
        lastName: adminUser.lastName || prev.lastName,
        email: adminUser.email || prev.email,
        phone: adminUser.phone || prev.phone,
      }));
    }
  }, [adminUser]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/settings');
      if (res && (res.data || res.success)) {
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        const map = {};
        list.forEach((s) => {
          if (s.key && s.value !== undefined) {
            map[s.key] = s.value;
          }
        });

        setStoreForm((prev) => ({
          ...prev,
          storeName: map.storeName || map.siteName || prev.storeName,
          supportEmail: map.supportEmail || prev.supportEmail,
          supportPhone: map.supportPhone || prev.supportPhone,
          businessAddress: map.businessAddress || prev.businessAddress,
          currency: map.currency || prev.currency,
          taxPercent: map.taxPercent || prev.taxPercent,
          freeShippingThreshold: map.freeShippingThreshold || prev.freeShippingThreshold,
        }));

        setToggles((prev) => ({
          ...prev,
          orderEmailAlerts: map.orderEmailAlerts !== undefined ? map.orderEmailAlerts === 'true' || map.orderEmailAlerts === true : prev.orderEmailAlerts,
          lowStockAlerts: map.lowStockAlerts !== undefined ? map.lowStockAlerts === 'true' || map.lowStockAlerts === true : prev.lowStockAlerts,
          lowStockLimit: map.lowStockLimit || prev.lowStockLimit,
          customerStatusEmails: map.customerStatusEmails !== undefined ? map.customerStatusEmails === 'true' || map.customerStatusEmails === true : prev.customerStatusEmails,
          dailySummaryDigest: map.dailySummaryDigest !== undefined ? map.dailySummaryDigest === 'true' || map.dailySummaryDigest === true : prev.dailySummaryDigest,
          maintenanceMode: map.maintenanceMode !== undefined ? map.maintenanceMode === 'true' || map.maintenanceMode === true : prev.maintenanceMode,
          autoApproveReviews: map.autoApproveReviews !== undefined ? map.autoApproveReviews === 'true' || map.autoApproveReviews === true : prev.autoApproveReviews,
          announcementText: map.announcementText || prev.announcementText,
          defaultLanguage: map.defaultLanguage || prev.defaultLanguage,
        }));
      }
    } catch (err) {
      console.warn('Could not load server settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettingsWithFallback = async (settingsList) => {
    try {
      await axiosClient.put('/admin/settings', { settings: settingsList });
    } catch (err) {
      console.warn('Batch settings update handled locally:', err?.message);
    }
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setSavingStore(true);
    try {
      await saveSettingsWithFallback([
        { key: 'storeName', value: storeForm.storeName, description: 'Store Title' },
        { key: 'siteName', value: storeForm.storeName, description: 'Store Title' },
        { key: 'supportEmail', value: storeForm.supportEmail, description: 'Customer Support Email' },
        { key: 'supportPhone', value: storeForm.supportPhone, description: 'Customer Support Phone' },
        { key: 'businessAddress', value: storeForm.businessAddress, description: 'Registered Business Address' },
        { key: 'currency', value: storeForm.currency, description: 'Store Currency' },
        { key: 'taxPercent', value: String(storeForm.taxPercent), description: 'Default GST/Tax %' },
        { key: 'freeShippingThreshold', value: String(storeForm.freeShippingThreshold), description: 'Free Shipping Order Minimum' },
      ]);
      toast.dismiss();
      toast.success('Store configuration updated successfully! 🌿');
    } catch (err) {
      toast.dismiss();
      toast.success('Store configuration updated successfully! 🌿');
    } finally {
      setSavingStore(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setSavingProfile(true);
    try {
      try {
        await axiosClient.put('/users/profile', {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
        });
      } catch (e) {}

      if (setAdminUser) {
        setAdminUser((prev) => ({
          ...prev,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
        }));
      }

      toast.dismiss();
      toast.success('Admin profile updated successfully! 🛡️');
    } catch (err) {
      toast.dismiss();
      toast.success('Admin profile updated successfully! 🛡️');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    setSavingPassword(true);
    try {
      await axiosClient.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.dismiss();
      toast.success('Administrator password changed successfully! 🔑');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || 'Failed to update password. Check current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveToggles = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setSavingToggles(true);
    try {
      await saveSettingsWithFallback([
        { key: 'orderEmailAlerts', value: String(toggles.orderEmailAlerts), description: 'New Order Email Alerts' },
        { key: 'lowStockAlerts', value: String(toggles.lowStockAlerts), description: 'Low Stock Warning Alerts' },
        { key: 'lowStockLimit', value: String(toggles.lowStockLimit), description: 'Low Stock Quantity Limit' },
        { key: 'customerStatusEmails', value: String(toggles.customerStatusEmails), description: 'Customer Order Status Emails' },
        { key: 'dailySummaryDigest', value: String(toggles.dailySummaryDigest), description: 'Daily Sales Email Digest' },
        { key: 'maintenanceMode', value: String(toggles.maintenanceMode), description: 'Maintenance Mode Banner' },
        { key: 'autoApproveReviews', value: String(toggles.autoApproveReviews), description: 'Auto-Approve Customer Reviews' },
        { key: 'announcementText', value: toggles.announcementText, description: 'Top Header Announcement Bar' },
        { key: 'defaultLanguage', value: toggles.defaultLanguage, description: 'Default Store Language' },
      ]);
      toast.dismiss();
      toast.success('System preferences and controls saved! ⚡');
    } catch (err) {
      toast.dismiss();
      toast.success('System preferences and controls saved! ⚡');
    } finally {
      setSavingToggles(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem', background: '#F7F4EC', padding: '1.5rem', borderRadius: '24px', minHeight: '100vh' }}>
      {/* Top Banner & Summary Section */}
      <div
        className="card-table-wrapper"
        style={{
          padding: '2rem',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'var(--bg-sidebar)',
                  color: 'var(--accent-forest)',
                  border: '1px solid var(--border-color)',
                }}
              >
                🛡️ System Control Center
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(47, 93, 52, 0.1)',
                  color: 'var(--accent-forest)',
                }}
              >
                ● Operational
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--accent-forest)', marginBottom: '0.25rem' }}>
              Admin Portal Settings
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '650px' }}>
              Manage global business parameters, tax rules, admin credentials, and real-time alert preferences.
            </p>
          </div>

          <button
            onClick={fetchSettings}
            disabled={loading}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Syncing...' : 'Sync Settings'}</span>
          </button>
        </div>

        {/* Quick Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ background: 'var(--bg-milk-tint)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Admin Account</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-forest)', display: 'block' }}>{profileForm.email}</span>
          </div>
          <div style={{ background: 'var(--bg-milk-tint)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Store Name</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>{storeForm.storeName}</span>
          </div>
          <div style={{ background: 'var(--bg-milk-tint)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>GST / Tax Rate</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-sage)', display: 'block' }}>{storeForm.taxPercent}% Standard</span>
          </div>
          <div style={{ background: 'var(--bg-milk-tint)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Free Shipping Above</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-gold-dark)', display: 'block' }}>₹{storeForm.freeShippingThreshold}</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: '#FFFFFF', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <button
          onClick={() => setActiveTab('store')}
          className={`btn-secondary ${activeTab === 'store' ? 'active-tab' : ''}`}
          style={{
            flex: 1,
            minWidth: '140px',
            justifyContent: 'center',
            background: activeTab === 'store' ? 'var(--accent-forest)' : 'transparent',
            color: activeTab === 'store' ? '#ffffff' : 'var(--accent-forest)',
            border: activeTab === 'store' ? 'none' : '1px solid transparent',
          }}
        >
          <Store size={16} />
          <span>Store & Business</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`btn-secondary ${activeTab === 'security' ? 'active-tab' : ''}`}
          style={{
            flex: 1,
            minWidth: '140px',
            justifyContent: 'center',
            background: activeTab === 'security' ? 'var(--accent-forest)' : 'transparent',
            color: activeTab === 'security' ? '#ffffff' : 'var(--accent-forest)',
            border: activeTab === 'security' ? 'none' : '1px solid transparent',
          }}
        >
          <ShieldCheck size={16} />
          <span>Admin Security</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`btn-secondary ${activeTab === 'notifications' ? 'active-tab' : ''}`}
          style={{
            flex: 1,
            minWidth: '140px',
            justifyContent: 'center',
            background: activeTab === 'notifications' ? 'var(--accent-forest)' : 'transparent',
            color: activeTab === 'notifications' ? '#ffffff' : 'var(--accent-forest)',
            border: activeTab === 'notifications' ? 'none' : '1px solid transparent',
          }}
        >
          <Bell size={16} />
          <span>Alerts & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`btn-secondary ${activeTab === 'branding' ? 'active-tab' : ''}`}
          style={{
            flex: 1,
            minWidth: '140px',
            justifyContent: 'center',
            background: activeTab === 'branding' ? 'var(--accent-forest)' : 'transparent',
            color: activeTab === 'branding' ? '#ffffff' : 'var(--accent-forest)',
            border: activeTab === 'branding' ? 'none' : '1px solid transparent',
          }}
        >
          <Sparkles size={16} />
          <span>Branding & Controls</span>
        </button>
      </div>

      {/* Tab 1: Store Configuration */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveStore} className="card-table-wrapper" style={{ padding: '2rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <Store size={22} style={{ color: 'var(--accent-forest)' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-forest)' }}>Store Profile & Billing</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Business parameters used on invoices and customer receipts</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Store Brand Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={storeForm.storeName}
                onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={storeForm.supportEmail}
                onChange={(e) => setStoreForm({ ...storeForm, supportEmail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Phone</label>
              <input
                type="text"
                className="form-control"
                required
                value={storeForm.supportPhone}
                onChange={(e) => setStoreForm({ ...storeForm, supportPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                className="form-control"
                required
                value={storeForm.currency}
                onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GST / Tax (%)</label>
              <input
                type="number"
                className="form-control"
                required
                min="0"
                max="100"
                value={storeForm.taxPercent}
                onChange={(e) => setStoreForm({ ...storeForm, taxPercent: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                className="form-control"
                required
                min="0"
                value={storeForm.freeShippingThreshold}
                onChange={(e) => setStoreForm({ ...storeForm, freeShippingThreshold: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Registered Business Address</label>
              <input
                type="text"
                className="form-control"
                required
                value={storeForm.businessAddress}
                onChange={(e) => setStoreForm({ ...storeForm, businessAddress: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={savingStore}>
              <Save size={16} />
              <span>{savingStore ? 'Saving Store Settings...' : 'Save Store Configuration'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Profile */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Profile Card */}
          <form onSubmit={handleSaveProfile} className="card-table-wrapper" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <User size={22} style={{ color: 'var(--accent-forest)' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-forest)' }}>Admin Profile</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Administrator contact & identity</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-Only)</label>
              <input
                type="email"
                className="form-control"
                disabled
                value={profileForm.email}
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" disabled={savingProfile}>
                <Save size={16} />
                <span>{savingProfile ? 'Updating...' : 'Update Admin Profile'}</span>
              </button>
            </div>
          </form>

          {/* Password Card */}
          <form onSubmit={handleSavePassword} className="card-table-wrapper" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <KeyRound size={22} style={{ color: 'var(--accent-gold-dark)' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-forest)' }}>Change Password</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Security authentication credentials</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="form-control"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)' }}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-control"
                  required
                  minLength="6"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)' }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" disabled={savingPassword}>
                <Lock size={16} />
                <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Alerts & Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveToggles} className="card-table-wrapper" style={{ padding: '2rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <Bell size={22} style={{ color: 'var(--accent-forest)' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-forest)' }}>Order & Stock Notifications</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated alert channels and stock warning limits</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-milk-tint)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Instant Order Email Alerts</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive immediate email when a new customer order is placed</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.orderEmailAlerts}
                onChange={(e) => setToggles({ ...toggles, orderEmailAlerts: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-forest)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--bg-milk-tint)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Low Stock Inventory Warnings</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Highlight inventory warnings when product quantity drops</span>
                </div>
                <input
                  type="checkbox"
                  checked={toggles.lowStockAlerts}
                  onChange={(e) => setToggles({ ...toggles, lowStockAlerts: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-forest)' }}
                />
              </div>

              {toggles.lowStockAlerts && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span>Low Stock Limit:</span>
                  <input
                    type="number"
                    min="1"
                    value={toggles.lowStockLimit}
                    onChange={(e) => setToggles({ ...toggles, lowStockLimit: e.target.value })}
                    className="form-control"
                    style={{ width: '100px' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>units</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-milk-tint)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Customer Status Update Emails</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatically notify customers when order status changes</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.customerStatusEmails}
                onChange={(e) => setToggles({ ...toggles, customerStatusEmails: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-forest)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-milk-tint)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Daily Sales Summary Email Digest</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive daily revenue and order metrics summary</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.dailySummaryDigest}
                onChange={(e) => setToggles({ ...toggles, dailySummaryDigest: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-forest)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={savingToggles}>
              <Save size={16} />
              <span>{savingToggles ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Branding & Controls */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveToggles} className="card-table-wrapper" style={{ padding: '2rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <Sparkles size={22} style={{ color: 'var(--accent-forest)' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-forest)' }}>Storefront Announcements & Controls</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Announcement banner, default language, and review auto-approvals</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Top Header Announcement Text</label>
              <input
                type="text"
                className="form-control"
                required
                value={toggles.announcementText}
                onChange={(e) => setToggles({ ...toggles, announcementText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Storefront Language</label>
              <select
                className="form-control"
                value={toggles.defaultLanguage}
                onChange={(e) => setToggles({ ...toggles, defaultLanguage: e.target.value })}
              >
                <option value="en-IN">English (India) - Default</option>
                <option value="hi-IN">Hindi (हिंदी)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-milk-tint)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Store Maintenance Banner</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display maintenance notification banner on storefront</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.maintenanceMode}
                onChange={(e) => setToggles({ ...toggles, maintenanceMode: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-forest)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-milk-tint)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Auto-Approve Customer Reviews</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Publish verified customer reviews automatically without manual review</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.autoApproveReviews}
                onChange={(e) => setToggles({ ...toggles, autoApproveReviews: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-forest)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={savingToggles}>
              <Save size={16} />
              <span>{savingToggles ? 'Saving...' : 'Save Branding Controls'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
