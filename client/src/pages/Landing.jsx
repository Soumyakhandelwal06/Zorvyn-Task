import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FlowButton } from '../components/ui/flow-button';
import {
  CheckCircle2, ArrowRight, BarChart3, ShieldCheck, FileText,
  TrendingUp, TrendingDown, Users, Lock, Download, Zap, ChevronRight, Shield, RefreshCcw,
  Wallet, Calculator, CreditCard, Banknote, PiggyBank, Coins, Receipt, Landmark
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
      timeout = setTimeout(() => { setText(current.slice(0, charIdx + 1)); setCharIdx(charIdx + 1); }, 45);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => { setText(current.slice(0, charIdx - 1)); setCharIdx(charIdx - 1); }, 25);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % typewriterPhrases.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <div style={{ marginBottom: '1.5rem', minHeight: '2.2rem', display: 'flex', alignItems: 'center', gap: 0 }}>
      <span style={{
        fontSize: '1.35rem', fontWeight: 700,
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        letterSpacing: '-0.02em',
      }}>
        {text}
      </span>
      <span style={{ display: 'inline-block', width: 2, height: '1.5rem', background: '#4f46e5', marginLeft: 3, animation: 'blink 1s step-end infinite' }} />
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
  useEffect(() => { if (inView) motionVal.set(end); }, [inView, end, motionVal]);
  useEffect(() => springVal.on('change', (v) => setDisplay(Math.floor(v))), [springVal]);
  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
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
          <div key={i} style={{ padding: '0.6rem 1.4rem', borderRadius: '8px', border: `1px solid ${item.border}`, background: '#fff', fontWeight: '600', fontSize: '0.88rem', color: item.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────── Dashboard Mockup ─────────────────────────────────── */
const DashboardMockup = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: 580 }}>
    {/* Gradient Glow behind the image */}
    <div style={{
      position: 'absolute', inset: '-10%', 
      background: 'radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 75%)',
      filter: 'blur(60px)', zIndex: 0 
    }} />

    <img src="/image1.jpeg" alt="Zorvyn Mockup" style={{ 
      width: '100%', height: 'auto', display: 'block', mixBlendMode: 'multiply', 
      filter: 'contrast(1.05)', borderRadius: 20, 
      boxShadow: '0 40px 80px -20px rgba(79, 70, 229, 0.25), 0 20px 40px -10px rgba(0, 0, 0, 0.1)', 
      position: 'relative', zIndex: 1 
    }} />
    
    {/* Decorative money/accounting icons */}
    <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-10%', left: '10%', opacity: 0.6, color: '#4f46e5' }}><Wallet size={28} /></motion.div>
    <motion.div animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }} style={{ position: 'absolute', bottom: '5%', right: '5%', opacity: 0.5, color: '#10b981' }}><Calculator size={32} /></motion.div>
    <motion.div animate={{ x: [0, 8, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }} style={{ position: 'absolute', top: '20%', right: '-15%', opacity: 0.4, color: '#f59e0b' }}><CreditCard size={24} /></motion.div>
    <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1.5 }} style={{ position: 'absolute', bottom: '25%', left: '-15%', opacity: 0.5, color: '#0ea5e9' }}><Banknote size={30} /></motion.div>
    {/* More icons for density */}
    <motion.div animate={{ y: [0, -15, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }} style={{ position: 'absolute', top: '35%', left: '-20%', opacity: 0.4, color: '#d946ef' }}><PiggyBank size={26} /></motion.div>
    <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 12, ease: 'linear' }} style={{ position: 'absolute', top: '-5%', right: '15%', opacity: 0.3, color: '#eab308' }}><Coins size={22} /></motion.div>
    <motion.div animate={{ y: [0, 8, 0], x: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '15%', right: '-10%', opacity: 0.4, color: '#64748b' }}><Receipt size={24} /></motion.div>
    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 2 }} style={{ position: 'absolute', top: '70%', left: '-5%', opacity: 0.3, color: '#312e81' }}><Landmark size={32} /></motion.div>

    {/* Floating badges on the mockup */}
    <motion.div
      animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: -16, right: -20, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <TrendingUp size={16} color="#10b981" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>Growth Analytics</span>
    </motion.div>
    
    <motion.div
      animate={{ y: [6, -6, 6] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: -16, left: -20, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <ShieldCheck size={16} color="#4f46e5" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>Audit Verified</span>
    </motion.div>

    <motion.div
      animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4.0, ease: 'easeInOut', delay: 0.5 }}
      style={{ position: 'absolute', top: 40, left: -24, background: '#f59e0b', color: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <Landmark size={16} color="#fff" />
      <span style={{ fontSize: 12, fontWeight: 700 }}>Accounting Hub</span>
    </motion.div>

    <motion.div
      animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1.2 }}
      style={{ position: 'absolute', bottom: 60, right: -18, background: '#0ea5e9', color: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 20px rgba(14,165,233,0.25)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
    >
      <Zap size={16} color="#fff" />
      <span style={{ fontSize: 12, fontWeight: 700 }}>Instant Payments</span>
    </motion.div>
  </div>
);

/* ─────────────────────────────────── Landing Page ─────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);

  const stats = [
    { val: 5000, suffix: '+', label: 'Transactions', icon: <FileText size={20} color="#4f46e5" /> },
    { val: 98, suffix: '%', label: 'Accuracy', icon: <ShieldCheck size={20} color="#10b981" /> },
    { val: 3, suffix: ' Roles', label: 'Access Control', icon: <Users size={20} color="#f59e0b" /> },
    { val: 100, suffix: '%', label: 'Export Ready', icon: <Download size={20} color="#ef4444" /> },
  ];

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
  ];

  return (
    <div style={{ 
      backgroundColor: '#fafbff', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#111827', overflowX: 'hidden',
      backgroundImage: [
        'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
        'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)'
      ].join(', '),
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
      backgroundPosition: '-1px -1px, -1px -1px, center'
    }}>
      
      {/* ── NAV ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 5rem', borderBottom: '1px solid #f3f4f6', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={16} color="#fff" />
          </div>
          <span style={{ color: '#4f46e5' }}>Zorvyn</span><span style={{ color: '#111827' }}>Fin</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
          <span 
            style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => e.target.style.color = '#4f46e5'}
            onMouseLeave={(e) => e.target.style.color = '#111827'}
          >
            Features
          </span>
          <span 
            style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => e.target.style.color = '#4f46e5'}
            onMouseLeave={(e) => e.target.style.color = '#111827'}
          >
            How It Works
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <FlowButton text="Sign In" onClick={() => navigate('/login')} />
          <FlowButton text="Get Started Free" onClick={() => navigate('/signup')} />
        </div>
      </nav>

      <section style={{ padding: '4rem 5rem 0', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
          {/* Left: Text Content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', background: '#eef2ff', color: '#4f46e5', padding: '0.45rem 1.15rem', borderRadius: 99, fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.6rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4f46e5' }} /> Multi-Role Platform <span style={{ background: '#4f46e5', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: 99, marginLeft: 5 }}>New</span>
            </div>
            <h1 style={{ fontSize: '3.4rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.2rem', fontFamily: "'DM Serif Display', serif" }}>
              <span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your Finances,</span><br />Finally Under <span style={{ color: '#10b981' }}>Control.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 540 }}>
              Track income and expenses, visualize financial health in real time, and control access with a <strong>secure, multi-role platform</strong>.
            </p>
            <TypewriterLine />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.5rem', maxWidth: 620 }}>
              {[
                { label: 'Multi-Role Teams', color: '#4f46e5', bg: '#eef2ff', icon: <Users size={14} /> },
                { label: 'Live Analytics', color: '#059669', bg: '#ecfdf5', icon: <TrendingUp size={14} /> },
                { label: 'Secure Audit Trail', color: '#d97706', bg: '#fffbeb', icon: <Shield size={14} /> },
                { label: 'One-Click Reporting', color: '#0284c7', bg: '#f0f9ff', icon: <FileText size={14} /> },
              ].map(f => (
                <motion.div
                  key={f.label}
                  whileHover={{ y: -3, boxShadow: `0 8px 16px ${f.color}22` }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    background: f.bg, color: f.color,
                    border: `1px solid ${f.color}35`,
                    padding: '0.5rem 1.25rem', borderRadius: 99,
                    fontSize: '0.86rem', fontWeight: 700,
                    boxShadow: `0 2px 6px ${f.color}15`,
                    cursor: 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{f.icon}</span>
                  {f.label}
                </motion.div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <FlowButton text="Start Free Now" onClick={() => navigate('/signup')} />
              <FlowButton text="Sign In" onClick={() => navigate('/login')} />
            </div>
          </motion.div>

          {/* Right: Mockup */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <DashboardMockup />
          </motion.div>
        </div>

        {/* ── FEATURE TICKER ── */}
        <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 0', overflow: 'hidden', margin: '0 -5rem' }}>
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 32, ease: 'linear' }} style={{ display: 'flex', gap: '1rem', width: 'max-content' }}>
            {[...Array(2)].flatMap(() => [
              { icon: '📊', text: 'Real-Time Dashboard', color: '#4f46e5', bg: '#eef2ff' },
              { icon: '🔐', text: 'Role-Based Access', color: '#059669', bg: '#ecfdf5' },
              { icon: '📁', text: 'Audit Trail', color: '#d97706', bg: '#fffbeb' },
              { icon: '📤', text: 'CSV Export', color: '#0284c7', bg: '#f0f9ff' },
              { icon: '💰', text: 'Income Tracking', color: '#7c3aed', bg: '#f5f3ff' },
              { icon: '📈', text: '6-Month Trends', color: '#059669', bg: '#ecfdf5' },
              { icon: '🏢', text: 'Multi-Role Teams', color: '#4f46e5', bg: '#eef2ff' },
              { icon: '🛡️', text: 'Secure JWT Auth', color: '#dc2626', bg: '#fef2f2' },
              { icon: '🔍', text: 'Category Filtering', color: '#0284c7', bg: '#f0f9ff' },
              { icon: '⚡', text: 'Instant Insights', color: '#d97706', bg: '#fffbeb' },
            ]).map((item, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: item.bg, border: `1px solid ${item.color}20`, borderRadius: 99, padding: '0.4rem 1.1rem', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                <span style={{ color: item.color, fontSize: '0.85rem', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section style={{ padding: '5rem 5rem', background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}><Counter end={s.val} suffix={s.suffix} /></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{ padding: '6rem 5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>Everything you need to manage finances</h2>
          <p style={{ color: '#64748b', maxWidth: 580, margin: '0 auto' }}>Built for for Admins, Analysts and Viewers.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -6, boxShadow: `0 12px 24px ${f.accent}15` }}
              style={{
                background: f.highlighted ? `linear-gradient(135deg, #fff, ${f.accent}05)` : '#fff',
                border: `1px solid ${f.highlighted ? f.accent + '33' : '#e2e8f0'}`,
                borderRadius: 24, padding: '2.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'border-color 0.3s ease'
              }}
            >
              <div style={{ background: `${f.accent}10`, padding: 12, borderRadius: 12, display: 'inline-flex', marginBottom: '1.25rem', color: f.accent }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES MARQUEE ── */}
      <section style={{ padding: '5rem 0', background: '#fafbff', borderTop: '1px solid #f1f5f9' }}>
        <Marquee items={industries} />
        <div style={{ marginTop: '1rem' }}><Marquee items={[...industries].reverse()} /></div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '6rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>Get started in 3 simple steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
          {[
            { step: '01', title: 'Create account', desc: 'Sign up in under 60 seconds.', icon: <Users size={32} /> },
            { step: '02', title: 'Record data', desc: 'Add income and expense entries.', icon: <FileText size={32} /> },
            { step: '03', title: 'Export & Analyze', desc: 'View charts and export CSV.', icon: <BarChart3 size={32} /> },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.2, ease: 'easeOut' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(79, 70, 229, 0.08)' }}
              style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 24, padding: '2rem',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ color: '#4f46e5', marginBottom: '1rem' }}>{s.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ margin: '0 5rem 6rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 32, padding: '4.5rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2.6rem', fontWeight: 700, marginBottom: '1rem', fontFamily: "'DM Serif Display', serif" }}>Ready to take control?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2.5rem' }}>Join teams already using Zorvyn Fin to track, analyze, and export financial data with precision.</p>
        <FlowButton text="Get Started Free Today" onClick={() => navigate('/signup')} dark />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '4rem 5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem' }}>
          <div style={{ width: 24, height: 24, background: '#4f46e5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart3 size={14} color="#fff" /></div>
          <span style={{ color: '#4f46e5' }}>Zorvyn</span><span>Fin</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>© 2026 ZorvynFin. Precision in Finance.</p>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          <span>Privacy</span><span>Terms</span><span>Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
