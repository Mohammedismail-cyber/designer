import React, { useState } from 'react';
import { X, User, Camera, Mail, Shield, CreditCard, BarChart2, Lock, Type, Info, LogOut, Link as LinkIcon, Check, Copy, Trash2 } from 'lucide-react';

export default function SettingsModal({ user, onClose, onLogout }) {
  const [topTab, setTopTab] = useState('account'); // 'account' | 'workspace'
  const [activeSideNav, setActiveSideNav] = useState('profile'); // 'profile' | 'security' | 'general' | 'invites' | 'billing'
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [members, setMembers] = useState([
    { name: user?.name || 'Mohammed', email: user?.email || 'mohammed@aurastudio.com', role: 'Owner' }
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://aurastudio.app/invite/ws_982314');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setMembers(m => [...m, { name: inviteEmail.split('@')[0], email: inviteEmail, role: 'Editor' }]);
    setInviteEmail('');
  };

  return (
    <div className="modal-overlay">
      <div className="animate-pop" style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '820px',
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>

        {/* ── TOP TABS: ACCOUNT vs WORKSPACE (Matches Reference Images 1 & 2) ── */}
        <div style={{
          height: '3.5rem',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #e4e4e7',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { key: 'account', label: 'Account Settings' },
              { key: 'workspace', label: 'Workspace Settings' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setTopTab(key); setActiveSideNav(key === 'account' ? 'profile' : 'general'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.85rem 0',
                  fontSize: '0.85rem',
                  fontWeight: topTab === key ? 700 : 500,
                  color: topTab === key ? '#9333ea' : '#71717a',
                  borderBottom: topTab === key ? '2px solid #a855f7' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="btn-ghost" title="Close Settings">
            <X size={18} color="#71717a" />
          </button>
        </div>

        {/* ── MAIN BODY: LEFT SIDEBAR + RIGHT CONTENT ─────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* LEFT SUB-NAV SIDEBAR */}
          <div style={{
            width: '200px',
            backgroundColor: '#fafafa',
            borderRight: '1px solid #e4e4e7',
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            {topTab === 'account' ? (
              <>
                <button
                  onClick={() => setActiveSideNav('profile')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: activeSideNav === 'profile' ? 700 : 500,
                    color: activeSideNav === 'profile' ? '#9333ea' : '#52525b',
                    backgroundColor: activeSideNav === 'profile' ? 'rgba(168,85,247,0.1)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <User size={14} /> Profile Information
                </button>
                <button
                  onClick={() => setActiveSideNav('security')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: activeSideNav === 'security' ? 700 : 500,
                    color: activeSideNav === 'security' ? '#9333ea' : '#52525b',
                    backgroundColor: activeSideNav === 'security' ? 'rgba(168,85,247,0.1)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <Shield size={14} /> Security & Auth
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveSideNav('general')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: activeSideNav === 'general' ? 700 : 500,
                    color: activeSideNav === 'general' ? '#9333ea' : '#52525b',
                    backgroundColor: activeSideNav === 'general' ? 'rgba(168,85,247,0.1)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <User size={14} /> Workspace General
                </button>
                <button
                  onClick={() => setActiveSideNav('invites')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: activeSideNav === 'invites' ? 700 : 500,
                    color: activeSideNav === 'invites' ? '#9333ea' : '#52525b',
                    backgroundColor: activeSideNav === 'invites' ? 'rgba(168,85,247,0.1)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <LinkIcon size={14} /> Members & Invites
                </button>
                <button
                  onClick={() => setActiveSideNav('billing')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: activeSideNav === 'billing' ? 700 : 500,
                    color: activeSideNav === 'billing' ? '#9333ea' : '#52525b',
                    backgroundColor: activeSideNav === 'billing' ? 'rgba(168,85,247,0.1)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <CreditCard size={14} /> Billing & Usage
                </button>
              </>
            )}
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

            {/* TAB 1: PROFILE */}
            {activeSideNav === 'profile' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090b', marginBottom: '0.25rem' }}>Profile Information</h3>
                <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.75rem' }}>Update your personal details and avatar icon.</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 800, color: 'white'
                  }}>
                    {user?.name ? user.name[0].toUpperCase() : 'M'}
                  </div>
                  <div>
                    <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '440px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#09090b', marginBottom: '0.35rem' }}>Display Name</label>
                    <input type="text" defaultValue={user?.name || 'Mohammed'} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#09090b', marginBottom: '0.35rem' }}>Email Address</label>
                    <input type="email" defaultValue={user?.email || 'mohammed@aurastudio.com'} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '0.85rem' }} />
                  </div>

                  <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    <button onClick={onLogout} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5', gap: '0.5rem' }}>
                      <LogOut size={15} /> Sign Out of Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INVITES & MEMBERS (Matches Reference Image 2) */}
            {activeSideNav === 'invites' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090b', marginBottom: '0.25rem' }}>Members & Invites</h3>
                <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.5rem' }}>Invite teammates to collaborate in your studio workspace.</p>

                {/* Copy Invite Link */}
                <div style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#09090b', marginBottom: '0.5rem' }}>Invite via Secret Link</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" readOnly value="https://aurastudio.app/invite/ws_982314" style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #e4e4e7', fontSize: '0.75rem', backgroundColor: '#ffffff' }} />
                    <button onClick={handleCopyLink} className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}>
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />} {copiedLink ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                {/* Invite Email Form */}
                <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <input
                    type="email"
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn-primary">Send Invite</button>
                </form>

                {/* Members List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa' }}>WORKSPACE MEMBERS ({members.length})</div>
                  {members.map((m, idx) => (
                    <div key={idx} style={{ padding: '0.65rem 0.85rem', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#09090b' }}>{m.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#71717a' }}>{m.email}</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9333ea', backgroundColor: 'rgba(168,85,247,0.1)', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BILLING & USAGE */}
            {activeSideNav === 'billing' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090b', marginBottom: '0.25rem' }}>Billing & Usage</h3>
                <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.75rem' }}>Manage subscription plan and view local LLM generation usage.</p>

                <div style={{ backgroundColor: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#9333ea' }}>Pro Studio Plan</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#a855f7', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '99px' }}>ACTIVE</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#52525b' }}>Unlimited local LLM generations, high-resolution code exports, and side-by-side artboards.</p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
