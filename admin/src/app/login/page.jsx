'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Leaf, Lock, Mail, ArrowRight, Eye, EyeOff, Send, X, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';


export default function LoginPage() {
  const [email, setEmail] = useState('admin@klnayurveda.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Forgot Password SMTP Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
      router.push('/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Please enter your admin email address.');
      return;
    }

    setSendingReset(true);
    try {
      const res = await axiosClient.post('/admin/auth/forgot-password', { email: forgotEmail });
      toast.success(res?.message || `If an account exists with ${forgotEmail}, a password reset link has been sent! 📧`, {
        duration: 5000,
        style: {
          background: '#FFFFFF',
          color: '#2F5D34',
          border: '1px solid rgba(47, 93, 52, 0.25)',
          borderRadius: '14px',
          fontWeight: '600',
        },
      });
      setIsForgotOpen(false);
      setForgotEmail('');
    } catch (err) {
      toast.error(err?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setSendingReset(false);
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-card relative">
        <div className="login-logo">
          <Leaf size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          KLN Ayurveda
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '2rem' }}>
          Sign in to access the administrator control panel
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@klnayurveda.com"
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.2rem' }}>
            <div className="flex justify-between items-center mb-1">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                style={{ fontSize: '0.78rem', color: 'var(--accent-forest)', fontWeight: '700', background: 'none', border: 'none' }}
                className="hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)' }}
                className="hover:text-black cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem', marginTop: '1rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          KLN Ayurveda Secure Portal &copy; 2026
        </div>
      </div>

      {/* Forgot Password SMTP Modal */}
      {isForgotOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <KeyRound size={20} className="text-[#2F5D34]" />
                <h3>Forgot Admin Password</h3>
              </div>
              <button className="btn-icon" onClick={() => setIsForgotOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSendResetEmail}>
              <div className="modal-body">
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Enter your registered admin email address. We will send you an <strong>SMTP password reset link</strong> instantly.
                </p>
                <div className="form-group">
                  <label className="form-label">Registered Admin Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@klnayurveda.com"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsForgotOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReset}
                  className="btn-primary"
                >
                  <Send size={16} />
                  <span>{sendingReset ? 'Sending SMTP Email...' : 'Send Reset Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
