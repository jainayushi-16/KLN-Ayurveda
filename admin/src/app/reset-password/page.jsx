'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosClient from '../../api/axiosClient';
import { Leaf, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function AdminResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!token) {
    return (
      <div className="login-card text-center">
        <div className="login-logo text-amber-600 bg-amber-50 mx-auto mb-4 flex items-center justify-center p-3 rounded-full w-14 h-14">
          <AlertTriangle size={28} />
        </div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Invalid Reset Link
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          No valid security token was provided in the URL.
        </p>
        <Link
          href="/login"
          className="btn-primary inline-flex justify-center items-center py-2.5 px-6 text-sm"
        >
          Return to Admin Login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/admin/auth/reset-password', {
        token,
        newPassword,
      });
      setResetSuccess(true);
      toast.success(res?.message || 'Admin password reset successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to reset password. Link may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="login-card text-center">
        <div className="login-logo text-emerald-600 bg-emerald-50 mx-auto mb-4 flex items-center justify-center p-3 rounded-full w-14 h-14">
          <CheckCircle size={28} />
        </div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Password Reset Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
          Your administrator account password has been updated successfully.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="btn-primary w-full justify-center py-3 text-sm"
        >
          Sign In to Dashboard
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="login-card relative">
      <div className="login-logo">
        <Leaf size={32} />
      </div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        Set Admin Password
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
        Enter your new secure credentials to regain control panel access
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <label className="form-label">New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
            />
            <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)' }}
              className="hover:text-black cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label className="form-label">Confirm New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat new password"
            />
            <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting}
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
        >
          {submitting ? 'Updating Password...' : 'Update Admin Password'}
          <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        KLN Ayurveda Admin Portal &copy; 2026
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="login-wrapper">
      <Suspense fallback={<div className="login-card text-center p-8">Loading security form...</div>}>
        <AdminResetPasswordForm />
      </Suspense>
    </div>
  );
}
