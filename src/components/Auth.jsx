import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import AuraLogo from './AuraLogo';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onLogin({
      email,
      name: name || email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#fafafa',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Top Purple Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Form Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <AuraLogo size={36} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            {isLogin ? 'Welcome back to Studio' : 'Create your account'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#71717a' }}>
            {isLogin ? 'Enter your details to access your workspace' : 'Start building frontend designs'}
          </p>
        </div>

        {/* Toggle Segment Bar */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f4f4f5',
          padding: '0.25rem',
          borderRadius: '10px',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.5rem 0',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              backgroundColor: isLogin ? '#ffffff' : 'transparent',
              color: isLogin ? '#09090b' : '#71717a',
              boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.5rem 0',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              backgroundColor: !isLogin ? '#ffffff' : 'transparent',
              color: !isLogin ? '#09090b' : '#71717a',
              boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#09090b', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#9ca3af" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.6rem',
                    borderRadius: '8px',
                    border: '1px solid #e4e4e7',
                    fontSize: '0.85rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#09090b', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="designer@aurastudio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.6rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#09090b', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.6rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {isLogin ? 'Sign In to Workspace' : 'Create Free Account'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Social Sign-In */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', borderTop: '1px solid #e4e4e7' }} />
            </div>
            <div style={{ position: 'relative', display: 'inline-block', backgroundColor: '#ffffff', padding: '0 0.75rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
              Or continue with
            </div>
          </div>

          <button
            onClick={() => onLogin({ email: 'google.user@aurastudio.com', name: 'Google User' })}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', height: '2.6rem', gap: '0.6rem', fontSize: '0.85rem' }}
          >
            {/* AUTHENTIC MULTICOLOR GOOGLE VECTOR LOGO */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>
        </div>

      </div>

      {/* Footer copyright */}
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
        © 2026 AuraStudio. All rights reserved.
      </div>
    </div>
  );
}
