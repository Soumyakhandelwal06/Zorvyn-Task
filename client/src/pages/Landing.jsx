import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FlowButton } from '../components/ui/flow-button';
import {
  CheckCircle2, ArrowRight, BarChart3, ShieldCheck, FileText,
  TrendingUp, TrendingDown, Users, Lock, Download, Zap, ChevronRight
} from 'lucide-react';

/* ─────────────────────────────────── Typewriter Line ─────────────────────────────────── */
const typewriterPhrases = [
  'Trusted by 500+ finance teams worldwide.',
  'Track every rupee — income, expense, balance.',
  'Role-based access keeps your data safe.',
  'Export audit-ready reports in one click.',
  'Real-time dashboards. Zero guesswork.',
  'Built for accountants. Loved by founders.',
  'From startups to enterprises — we scale with you.',
];

const TypewriterLine = () => {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(() => Math.floor(Math.random() * typewriterPhrases.length));
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = typewriterPhrases[phraseIdx];
    let timeout;

    if (!deleting && charIdx < current.length) {
      // Typing
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, 45);
    } else if (!deleting && charIdx === current.length) {
      // Pause at end
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, 25);
    } else if (deleting && charIdx === 0) {
      // Move to next phrase
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % typewriterPhrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <div style={{ marginBottom: '1.5rem', minHeight: '2.2rem', display: 'flex', alignItems: 'center', gap: 0 }}>
      <span style={{
        fontSize: '1.35rem',
        fontWeight: 700,
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.02em',
      }}>
        {text}
      </span>
      <span style={{
        display: 'inline-block',
        width: 2,
        height: '1.5rem',
        background: '#4f46e5',
        marginLeft: 3,
        animation: 'blink 1s step-end infinite',
      }} />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
};

/* ─────────────────────────────────── Animated Counter ─────────────────────────────────── */
const Counter = ({ end, prefix = '', suffix = '', duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { duration: duration * 1000 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(end);
  }, [inView, end, motionVal]);

  useEffect(() => springVal.on('change', (v) => setDisplay(Math.floor(v))), [springVal]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
};

/* ─────────────────────────────────── Scrolling Marquee ─────────────────────────────────── */
const Marquee = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        style={{ display: 'flex', gap: '1rem', width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{
            padding: '0.6rem 1.4rem',
            borderRadius: '8px',
            border: `1px solid ${item.border}`,
            background: '#fff',
            fontWeight: '600',
            fontSize: '0.88rem',
            color: item.color,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────── Dashboard Mockup ─────────────────────────────────── */
const DashboardMockup = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: 580, marginLeft: '2rem' }}>
    {/* Gradient Glow behind the image */}
    <div style={{
      position: 'absolute', inset: '-10%', 
      background: 'radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 75%)',
      filter: 'blur(60px)', zIndex: 0 
    }} />

    <img 
      src="/image1.jpeg" 
      alt="Zorvyn Finance Budgeting and Planning" 
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        mixBlendMode: 'multiply',
        filter: 'contrast(1.05)',
        borderRadius: 16,
        boxShadow: '0 40px 80px -20px rgba(79, 70, 229, 0.2), 0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1
      }}
    />

    {/* Floating badges on the mockup */}
    <motion.div
      animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: -16, right: -20, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <TrendingUp size={16} color="#10b981" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>+32% Revenue</span>
    </motion.div>
    
    <motion.div
      animate={{ y: [6, -6, 6] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: -16, left: -20, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <ShieldCheck size={16} color="#4f46e5" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>Audit Ready</span>
    </motion.div>

    <motion.div
      animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4.0, ease: 'easeInOut', delay: 0.5 }}
      style={{ position: 'absolute', top: 40, left: -30, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <Zap size={16} color="#f59e0b" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Bank Synced</span>
    </motion.div>

    <motion.div
      animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1.2 }}
      style={{ position: 'absolute', bottom: 60, right: -25, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <CheckCircle2 size={16} color="#0ea5e9" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#0ea5e9' }}>Invoice Paid</span>
    </motion.div>
  </div>
);

/* ─────────────────────────────────── Landing Page ─────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const features = [
    {
      icon: <BarChart3 size={28} color="#4f46e5" />,
      accent: '#4f46e5',
      tag: 'Live Insights',
      title: 'Real-Time Dashboard',
      desc: 'Monitor income, expenses, and net balance through beautiful charts — all updating as your data changes.',
    },
    {
      icon: <ShieldCheck size={28} color="#10b981" />,
      accent: '#10b981',
      tag: 'Enterprise Grade',
      title: 'Role-Based Access Control',
      desc: 'Assign Admin, Analyst, or Viewer roles. Keep sensitive financial data protected with granular permissions.',
      highlighted: true,
    },
    {
      icon: <FileText size={28} color="#f59e0b" />,
      accent: '#f59e0b',
      tag: 'One Click',
      title: 'Instant CSV Export',
      desc: 'Export any transaction report to CSV in a single click. Ready for accountants, auditors, or investors.',
    },
  ];

  const industries = [
    { text: 'Retail Shops', color: '#4f46e5', border: '#e0e7ff' },
    { text: 'Freelancers', color: '#10b981', border: '#d1fae5' },
    { text: 'Tech Startups', color: '#3b82f6', border: '#dbeafe' },
    { text: 'Restaurants', color: '#f59e0b', border: '#fef3c7' },
    { text: 'Photography Studios', color: '#ec4899', border: '#fce7f3' },
    { text: 'Law Firms', color: '#6b7280', border: '#f3f4f6' },
    { text: 'Healthcare Clinics', color: '#14b8a6', border: '#ccfbf1' },
    { text: 'Manufacturing', color: '#ef4444', border: '#fee2e2' },
    { text: 'Real Estate', color: '#8b5cf6', border: '#ede9fe' },
    { text: 'NGOs & Trusts', color: '#f97316', border: '#ffedd5' },
    { text: 'Consulting Firms', color: '#0ea5e9', border: '#e0f2fe' },
    { text: 'E-commerce', color: '#10b981', border: '#d1fae5' },
  ];

  const stats = [
    { val: 5000, suffix: '+', label: 'Transactions Tracked', icon: <FileText size={20} color="#4f46e5" /> },
    { val: 98, suffix: '%', label: 'Audit Accuracy', icon: <ShieldCheck size={20} color="#10b981" /> },
    { val: 3, suffix: ' Roles', label: 'Access Levels', icon: <Users size={20} color="#f59e0b" /> },
    { val: 100, suffix: '%', label: 'Export Ready', icon: <Download size={20} color="#ef4444" /> },
  ];

  return (
    <div style={{
      backgroundColor: '#fafbff',
      minHeight: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#111827',
      overflowX: 'hidden',
      // Subtle background grid + Animated mesh gradient
      backgroundImage: [
        'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
        'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.18) 0%, transparent 60%)',
        'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(139,92,246,0.15) 0%, transparent 55%)',
        'radial-gradient(ellipse 50% 40% at 10% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)',
      ].join(', '),
      backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%, 100% 100%',
      backgroundPosition: '-1px -1px, -1px -1px, center, center, center',
    }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 5rem', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={16} color="#fff" />
          </div>
          <span style={{ color: '#4f46e5' }}>Zorvyn</span><span style={{ color: '#111827' }}>Fin</span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>
          {['Features', 'How It Works'].map(l => (
            <span key={l} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#4f46e5'} onMouseOut={e => e.target.style.color='#374151'}>{l}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <FlowButton text="Sign In" onClick={() => navigate('/login')} />
          <FlowButton text="Get Started Free" onClick={() => navigate('/signup')} />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '2.5rem 4rem 0', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2rem', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
              background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#4f46e5', padding: '0.45rem 1.15rem', borderRadius: 99,
              fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.6rem',
              boxShadow: '0 0 0 3px rgba(99,102,241,0.08)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#4f46e5', flexShrink: 0 }}
            />
            Multi-Role Finance Management Platform
            <span style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 99, marginLeft: 4 }}>New</span>
          </motion.div>

          {/* Headline */}
          <h1 style={{ fontSize: '3.8rem', lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '1.2rem', fontFamily: "'DM Serif Display', Georgia, serif" }}>
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Your Finances,</span>
            <br />
            <span style={{ color: '#0f172a' }}>Finally Under</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Control.</span>
          </h1>

          <p style={{ fontSize: '1.08rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: 620 }}>
            Record income and expenses, visualize your financial health in real time, control who sees what, and export reports — all in one <strong style={{ color: '#374151', fontWeight: 600 }}>secure platform</strong>.
          </p>

          {/* Dynamic typewriter line */}
          <div style={{ marginBottom: '1.25rem' }}>
            <TypewriterLine />
          </div>

          {/* Feature pills — colored & icon-forward */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.5rem', maxWidth: 620 }}>
            {[
              { label: 'Role-Based Access', color: '#4f46e5', bg: '#eef2ff', icon: '🔐' },
              { label: 'Real-Time Dashboard', color: '#059669', bg: '#ecfdf5', icon: '📊' },
              { label: 'Audit Logs', color: '#d97706', bg: '#fffbeb', icon: '📋' },
              { label: 'CSV Export', color: '#0284c7', bg: '#f0f9ff', icon: '📤' },
            ].map(f => (
              <div key={f.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: f.bg, color: f.color,
                border: `1px solid ${f.color}28`,
                padding: '0.45rem 1.15rem', borderRadius: 99,
                fontSize: '0.85rem', fontWeight: 600,
                boxShadow: `0 2px 6px ${f.color}18`,
              }}>
                <span style={{ fontSize: '0.9rem' }}>{f.icon}</span>{f.label}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <FlowButton
              text="Start Free Today"
              onClick={() => navigate('/signup')}
            />
            <FlowButton
              text="Sign In"
              onClick={() => navigate('/login')}
            />
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#9ca3af' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem' }}>🔒</span> No credit card required
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem' }}>⚡</span> Setup in under 2 minutes
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem' }}>🛡️</span> Enterprise-grade security
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} style={{ position: 'relative' }}>
          <DashboardMockup />
        </motion.div>
        </div>

        {/* ── FEATURE TICKER STRIP (spanning width, visible on load) ── */}
        <div style={{ marginTop: '2.5rem', marginLeft: '-5rem', marginRight: '-5rem', background: 'transparent', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '0.65rem 0', overflow: 'hidden' }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
            style={{ display: 'flex', gap: '0.75rem', width: 'max-content', padding: '0 0.375rem' }}
          >
            {[...Array(2)].flatMap(() => [
              { icon: '📊', text: 'Real-Time Dashboard', color: '#4f46e5', bg: '#eef2ff' },
              { icon: '🔐', text: 'Role-Based Access Control', color: '#059669', bg: '#ecfdf5' },
              { icon: '📁', text: 'Audit Trail & Logs', color: '#d97706', bg: '#fffbeb' },
              { icon: '📤', text: 'One-Click CSV Export', color: '#0284c7', bg: '#f0f9ff' },
              { icon: '💰', text: 'Income & Expense Tracking', color: '#7c3aed', bg: '#f5f3ff' },
              { icon: '📈', text: '6-Month Trend Analysis', color: '#059669', bg: '#ecfdf5' },
              { icon: '🏢', text: 'Multi-Role Teams', color: '#4f46e5', bg: '#eef2ff' },
              { icon: '🛡️', text: 'Secure JWT Auth', color: '#dc2626', bg: '#fef2f2' },
              { icon: '🔍', text: 'Category Filtering', color: '#0284c7', bg: '#f0f9ff' },
              { icon: '⚡', text: 'Instant Insights', color: '#d97706', bg: '#fffbeb' },
            ]).map((item, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: item.bg, border: `1px solid ${item.color}22`, borderRadius: 99, padding: '0.3rem 0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <span style={{ fontSize: '0.82rem' }}>{item.icon}</span>
                <span style={{ color: item.color, fontSize: '0.82rem', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ANIMATED STATS ── */}
      <section style={{ padding: '4rem 5rem', background: 'linear-gradient(180deg, #fafbff 0%, #ffffff 100%)', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ background: '#fff', padding: 14, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', color: '#4f46e5' }}>
                  {s.icon}
                </div>
              </div>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
                <Counter end={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '6rem 5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eef2ff', color: '#4f46e5', padding: '0.4rem 1rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem', border: '1px solid rgba(79,70,229,0.1)' }}>
            <Zap size={13} fill="#4f46e5" /> Core Capabilities
          </div>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem', color: '#0f172a', fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Everything you need to manage finances
          </h2>
          <p style={{ color: '#64748b', maxWidth: 580, margin: '0 auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Built for Admins, Analysts and Viewers — Zorvyn Fin adapts to the way your modern team actually works.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              style={{
                background: f.highlighted ? `linear-gradient(135deg, #ffffff, ${f.accent}08)` : '#fff',
                border: `1px solid ${f.highlighted ? f.accent + '44' : '#e2e8f0'}`,
                borderRadius: 24,
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: f.highlighted ? `0 20px 40px ${f.accent}12` : '0 4px 20px rgba(0,0,0,0.03)',
                cursor: 'default',
              }}
              whileHover={{ y: -6, boxShadow: `0 30px 60px ${f.accent}15`, borderColor: f.accent + '88' }}
            >
              <div style={{ background: `${f.accent}10`, padding: 14, borderRadius: 16, display: 'inline-flex', marginBottom: '1.5rem', color: f.accent }}>
                {f.icon}
              </div>
              <div style={{ color: f.accent, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{f.tag}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '1rem' }}>{f.desc}</p>
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: f.accent, fontSize: '0.95rem', fontWeight: 700 }}>
                Explore feature <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SCROLLING MARQUEE INDUSTRIES ── */}
      <section style={{ padding: '5rem 0', background: '#fafbff', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <div style={{ padding: '0 5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem', fontFamily: "'DM Serif Display', Georgia, serif", color: '#0f172a' }}>
            Trusted by teams across <span style={{ color: '#4f46e5' }}>every industry</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            From solo freelancers to multi-department enterprises — Zorvyn Fin scales with your complexity.
          </p>
        </div>
        <Marquee items={industries} />
        <div style={{ marginTop: '1.25rem' }}>
          <Marquee items={[...industries].reverse()} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '6rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem', fontFamily: "'DM Serif Display', Georgia, serif", color: '#0f172a' }}>Get started in 3 simple steps</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>No complex setup. Just clean, powerful finance management for your team.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem' }}>
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up in under 60 seconds. Assign your role — Admin, Analyst, or Viewer — and you\'re ready to go.', icon: <Users size={32} /> },
            { step: '02', title: 'Record transactions', desc: 'Add income and expense entries with category, date, and description. Validate data using built-in schema rules.', icon: <FileText size={32} /> },
            { step: '03', title: 'Analyze & export', desc: 'View real-time charts, category breakdowns, 6-month trends, and export clean CSV reports anytime.', icon: <BarChart3 size={32} /> },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 16, color: '#4f46e5', border: '1px solid #f1f5f9' }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1, fontFamily: "'DM Serif Display', serif" }}>{s.step}</span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>{s.title}</h3>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ margin: '0 5rem 6rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: 32, padding: '4.5rem 5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(79,70,229,0.25)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle decorative circles for CTA */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: 200, height: 200, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.2 }}>Ready to take control of your finances?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.6 }}>Join teams already using Zorvyn Fin to track, analyze, and export their financial data with precision.</p>
        </div>
        <FlowButton
          text="Get Started Free"
          onClick={() => navigate('/signup')}
          dark
        />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #f1f5f9', padding: '3rem 5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem' }}>
          <div style={{ width: 24, height: 24, background: '#4f46e5', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={14} color="#fff" />
          </div>
          <span style={{ color: '#4f46e5', letterSpacing: '-0.02em' }}>Zorvyn</span><span style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>Fin</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>© 2026 ZorvynFin. Precision in Finance.</p>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          <span style={{ cursor: 'pointer' }} className="hover:text-indigo-600 transition-colors">Privacy</span>
          <span style={{ cursor: 'pointer' }} className="hover:text-indigo-600 transition-colors">Terms</span>
          <span style={{ cursor: 'pointer' }} className="hover:text-indigo-600 transition-colors">Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
