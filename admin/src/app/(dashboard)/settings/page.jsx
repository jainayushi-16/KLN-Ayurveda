'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axiosClient from '../../../api/axiosClient';
import { User, Lock, Store, Save, Mail, Send, CheckCircle } from 'lucide-react';
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

  // SMTP Gateway Settings state
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('noreply@klnayurveda.com');
  const [smtpFromName, setSmtpFromName] = useState('KLN Ayurveda');
  const [smtpSecure, setSmtpSecure] = useState('false');
  const [savingSmtp, setSavingSmtp] = useState(false);
  
  // Test Email state
  const [testRecipient, setTestRecipient] = useState('');
  const [testingSmtp, setTestingSmtp] = useState(false);

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
            
            // SMTP Settings
            if (s.key === 'smtpHost') setSmtpHost(s.value);
            if (s.key === 'smtpPort') setSmtpPort(s.value);
            if (s.key === 'smtpUser') setSmtpUser(s.value);
            if (s.key === 'smtpPass') setSmtpPass(s.value);
            if (s.key === 'smtpFrom') setSmtpFrom(s.value);
            if (s.key === 'smtpFromName') setSmtpFromName(s.value);
            if (s.key === 'smtpSecure') setSmtpSecure(s.value);
          });
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (adminUser?.email && !testRecipient) {
      setTestRecipient(adminUser.email);
    }
  }, [adminUser, testRecipient]);

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

  const handleSaveSmtpSettings = async (e) => {
    e.preventDefault();
    setSavingSmtp(true);
    try {
      const smtpList = [
        { key: 'smtpHost', value: smtpHost, description: 'SMTP Server Host' },
        { key: 'smtpPort', value: smtpPort, description: 'SMTP Server Port' },
        { key: 'smtpUser', value: smtpUser, description: 'SMTP Auth Username/Email' },
        { key: 'smtpPass', value: smtpPass, description: 'SMTP Auth Password/App Key' },
        { key: 'smtpFrom', value: smtpFrom, description: 'Sender From Email Address' },
        { key: 'smtpFromName', value: smtpFromName, description: 'Sender Display Name' },
        { key: 'smtpSecure', value: smtpSecure, description: 'Use SSL/TLS (true/false)' },
      ];

      for (const item of smtpList) {
        await axiosClient.put('/admin/settings', item);
      }
      toast.success('SMTP Configuration saved & transporter reloaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to save SMTP settings');
    } finally {
      setSavingSmtp(false);
    }
  };

  const handleTestSmtp = async (e) => {
    e.preventDefault();
    if (!testRecipient) {
      toast.error('Please enter a recipient email for testing');
      return;
    }
    setTestingSmtp(true);
    const toastId = toast.loading('Connecting to SMTP Server & sending test email...');
    try {
      const res = await axiosClient.post('/admin/smtp/test', { to: testRecipient });
      if (res.success) {
        toast.success(`Test email sent successfully to ${testRecipient}!`, { id: toastId });
      } else {
        toast.error(res.message || 'SMTP Connection test failed', { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to connect to SMTP server. Check credentials.', { id: toastId });
    } finally {
      setTestingSmtp(false);
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

      {/* SMTP Email Gateway Settings */}
      <div className="card-table-wrapper" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <Mail size={22} style={{ color: 'var(--accent-gold)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>SMTP Email Gateway Configuration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure email server credentials for order notifications, passwords, and newsletter dispatches</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <form onSubmit={handleSaveSmtpSettings}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} />
              <span>Server & Authentication Credentials</span>
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SMTP Host</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="smtp.gmail.com"
                  required
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SMTP Port</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="587"
                  required
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SMTP User / Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="your-email@gmail.com"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SMTP Password / App Key</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••••••••••"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sender Email ("From")</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="noreply@klnayurveda.com"
                  required
                  value={smtpFrom}
                  onChange={(e) => setSmtpFrom(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sender Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="KLN Ayurveda"
                  required
                  value={smtpFromName}
                  onChange={(e) => setSmtpFromName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Security Mode</label>
              <select
                className="form-control"
                value={smtpSecure}
                onChange={(e) => setSmtpSecure(e.target.value)}
              >
                <option value="false">STARTTLS / Port 587 (Standard)</option>
                <option value="true">SSL / Port 465 (Secure)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={savingSmtp} style={{ marginTop: '0.75rem' }}>
              <Save size={16} />
              <span>{savingSmtp ? 'Saving Credentials...' : 'Save SMTP Configuration'}</span>
            </button>
          </form>

          {/* Test SMTP Box */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>Send Real Email to Your Inbox</span>
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                Enter your real personal or business email address below to receive an instant verification email from your server.
              </p>

              <div className="form-group">
                <label className="form-label">Your Real Email Address (Destination Inbox)</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your-email@gmail.com"
                  required
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Enter your active email address where you want to receive the email.
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="btn-primary"
                disabled={testingSmtp}
                onClick={handleTestSmtp}
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', background: 'linear-gradient(135deg, #2e7d32, #1b5e20)' }}
              >
                <Send size={16} />
                <span>{testingSmtp ? 'Sending Real Email...' : 'Send Real Email to My Inbox'}</span>
              </button>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} style={{ color: '#4caf50' }} />
                <span>Real email will be delivered to your inbox immediately</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

