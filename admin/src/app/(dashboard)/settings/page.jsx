'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axiosClient from '../../../api/axiosClient';
import { User, Lock, Store, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { adminUser } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  // Store Settings state
  const [storeName, setStoreName] = useState('KLN Ayurveda');
  const [supportEmail, setSupportEmail] = useState('support@klnayurveda.com');
  const [supportPhone, setSupportPhone] = useState('+91 9876543210');
  const [taxPercent, setTaxPercent] = useState('18');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('999');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosClient.get('/admin/settings');
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((s) => {
            if (s.key === 'storeName') setStoreName(s.value);
            if (s.key === 'supportEmail') setSupportEmail(s.value);
            if (s.key === 'supportPhone') setSupportPhone(s.value);
            if (s.key === 'taxPercent') setTaxPercent(s.value);
            if (s.key === 'freeShippingThreshold') setFreeShippingThreshold(s.value);
          });
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setUpdatingPass(true);
    try {
      const res = await axiosClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.success) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const settingsList = [
        { key: 'storeName', value: storeName, description: 'Store Title' },
        { key: 'supportEmail', value: supportEmail, description: 'Support Email Address' },
        { key: 'supportPhone', value: supportPhone, description: 'Support Phone Number' },
        { key: 'taxPercent', value: taxPercent, description: 'Default GST/Tax %' },
        { key: 'freeShippingThreshold', value: freeShippingThreshold, description: 'Free Shipping Threshold Amount' },
      ];

      for (const item of settingsList) {
        await axiosClient.put('/admin/settings', item);
      }
      toast.success('Store configuration saved!');
    } catch (err) {
      toast.error(err.message || 'Failed to save store settings');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
      {/* Admin Profile & Password */}
      <div className="card-table-wrapper" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <User size={22} style={{ color: 'var(--accent-gold)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Admin Profile & Password</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage administrator security credentials</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account Email</div>
          <div style={{ fontWeight: '600', color: 'var(--accent-gold-light)' }}>{adminUser?.email}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Account Role</div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{adminUser?.role}</div>
        </div>

        <form onSubmit={handleChangePassword}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Change Password</h4>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              required
              minLength="6"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={updatingPass} style={{ marginTop: '0.5rem' }}>
            <Lock size={16} />
            <span>{updatingPass ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Store Settings */}
      <div className="card-table-wrapper" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <Store size={22} style={{ color: 'var(--accent-gold)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Store Configuration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Global business & tax parameters</p>
          </div>
        </div>

        <form onSubmit={handleSaveStoreSettings}>
          <div className="form-group">
            <label className="form-label">Store Brand Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Support Phone</label>
              <input
                type="text"
                className="form-control"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GST / Tax (%)</label>
              <input
                type="number"
                className="form-control"
                required
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Free Shipping Minimum (₹)</label>
              <input
                type="number"
                className="form-control"
                required
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={savingSettings} style={{ marginTop: '0.5rem' }}>
            <Save size={16} />
            <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
