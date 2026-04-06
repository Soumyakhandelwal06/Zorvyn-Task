import { useState, useEffect } from "react";
import { 
  BarChart3, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Users, Eye, EyeOff,
  Wallet, Coins, Banknote, Landmark, Calculator, RefreshCcw, Lock, Download, Shield, FileText,
  CreditCard, PiggyBank, Receipt, DollarSign, PieChart, Tag, Search, TrendingDown,
  Briefcase, CircleDollarSign, Percent, ClipboardList, Scale, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// ─── Animated Finance Background for left panel ───────────────────────────────
const FinanceBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    {/* Cross grid pattern */}
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a5b4fc" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Floating glow orbs */}
    <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", top: -80, left: -60 }} />
    <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", bottom: -40, right: -40 }} />
  </div>
);

// ─── Floating Background Icons ───────────────────────────────────────────────
const FloatingBackgroundIcons = () => {
  const icons = [
    { Icon: Wallet, top: '8%', left: '5%', delay: 0, color: '#6366f1' },
    { Icon: PiggyBank, top: '12%', right: '6%', delay: 1, color: '#f59e0b' },
    { Icon: Landmark, bottom: '15%', left: '4%', delay: 2, color: '#10b981' },
    { Icon: CreditCard, bottom: '10%', right: '5%', delay: 3, color: '#4f46e5' },
    { Icon: Coins, top: '40%', right: '3%', delay: 0.5, color: '#f59e0b' },
    { Icon: Receipt, bottom: '45%', left: '2%', delay: 1.5, color: '#10b981' },
    { Icon: Banknote, top: '80%', left: '5%', delay: 2.2, color: '#6366f1' },
    { Icon: Calculator, bottom: '35%', right: '4%', delay: 1.2, color: '#4f46e5' },
    { Icon: DollarSign, top: '25%', left: '1.5%', delay: 0.6, color: '#818cf8' },
    { Icon: PieChart, top: '60%', right: '2.5%', delay: 1.9, color: '#10b981' },
    { Icon: Tag, bottom: '25%', left: '3.5%', delay: 2.4, color: '#f59e0b' },
    { Icon: Search, top: '15%', right: '1.5%', delay: 1.1, color: '#6366f1' },
    { Icon: TrendingDown, bottom: '50%', right: '4.5%', delay: 2.8, color: '#ef4444' },
    { Icon: FileText, top: '90%', left: '2%', delay: 1.5, color: '#818cf8' },
    { Icon: Briefcase, top: '5%', left: '3%', delay: 0.2, color: '#6366f1' },
    { Icon: CircleDollarSign, top: '45%', right: '2%', delay: 1.8, color: '#10b981' },
    { Icon: Percent, bottom: '5%', left: '1.5%', delay: 2.2, color: '#f59e0b' },
    { Icon: ClipboardList, top: '75%', right: '4%', delay: 1.4, color: '#4f46e5' },
    { Icon: Scale, bottom: '35%', left: '2.5%', delay: 0.9, color: '#6366f1' },
    { Icon: Globe, top: '30%', right: '5%', delay: 3.1, color: '#10b981' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {icons.map(({ Icon, top, right, bottom, left, delay, color }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 0.12, 0.08], 
            scale: [0.5, 1, 1],
            y: [0, -15, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            opacity: { duration: 2 },
            scale: { duration: 2 }, y: { repeat: Infinity, duration: 6 + i, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 8 + i, ease: 'easeInOut' },
            delay: delay
          }}
          style={{ position: 'absolute', top, right, bottom, left, color }}
        >
          <Icon size={36 + (i % 3) * 8} />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Feature pill ─────────────────────────────────────────────────────────────
const FeaturePill = ({ icon, text, color, bg, delay, style }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.45 }}
    style={{ 
      position: 'absolute', zIndex: 10, ...style,
      display: "flex", alignItems: "center", gap: 10, background: bg, 
      borderRadius: 12, padding: "10px 16px", border: `1px solid ${color}15`, 
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)" 
    }}
  >
    <span style={{ color }}>{icon}</span>
    <span style={{ color: "#111827", fontSize: "0.85rem", fontWeight: 700 }}>{text}</span>
  </motion.div>
);

// ─── Role Option ──────────────────────────────────────────────────────────────
const ROLES = [
  { value: "VIEWER", label: "Viewer", desc: "View reports & dashboards", icon: <Eye size={14} /> },
  { value: "ANALYST", label: "Analyst", desc: "Add & manage transactions", icon: <TrendingUp size={14} /> },
];

// ─── Main Signup Component ────────────────────────────────────────────────────
const ZorvynSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    if (!password || password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      await signup(email, password, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", backgroundColor: "#fafbff",
        padding: 16, overflowY: "auto",
        backgroundImage: [
          'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
          'radial-gradient(circle at 0% 0%, rgba(99,102,241,0.06) 0%, transparent 40%)',
          'radial-gradient(circle at 100% 100%, rgba(16,185,129,0.06) 0%, transparent 40%)'
        ].join(','),
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%'
      }}
    >
      <FloatingBackgroundIcons />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%", maxWidth: 920, borderRadius: 24, overflow: "hidden",
          display: "flex", flexDirection: "row",
          boxShadow: "0 28px 72px -12px rgba(79,70,229,0.15), 0 0 0 1px rgba(226,232,240,0.8)"
        }}
      >
        {/* ── LEFT: Dark brand panel ── */}
        <div
          className="hidden md:flex"
          style={{
            width: "42%", flexShrink: 0, position: "relative", flexDirection: "column",
            justifyContent: "space-between", padding: "2.5rem 2rem",
            background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #1e2a4a 100%)",
            overflow: "hidden"
          }}
        >
          <FinanceBackground />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                <BarChart3 size={18} color="#fff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', fontSize: "1.1rem", fontWeight: 800 }}>
                <span style={{ color: '#fff' }}>Zorvyn</span><span style={{ color: '#a5b4fc' }}>Fin</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'DM Serif Display', serif" }}
            >
              The smart finance platform for modern businesses
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ fontSize: "0.92rem", color: "#a5b4fc", lineHeight: 1.6, marginBottom: 32 }}
            >
              Track every rupee with real-time technical insights. Multi-role access keeps your financial data secure.
            </motion.p>
          </div>

          {/* Floating and Separated Feature Pills – Positioned organically at sides */}
          {/* LEFT SIDE */}
          <FeaturePill icon={<Users size={16} />} text="Multi-Role Teams" color="#818cf8" bg="#eef2ff" delay={0.7} style={{ position: 'fixed', left: '3%', top: '20%', zIndex: 100 }} />
          <FeaturePill icon={<Shield size={16} />} text="Secure Audit Trail" color="#f59e0b" bg="#fffbeb" delay={0.94} style={{ position: 'fixed', left: '5%', top: '55%', zIndex: 100 }} />

          {/* RIGHT SIDE */}
          <FeaturePill icon={<TrendingUp size={16} />} text="Live Analytics" color="#10b981" bg="#ecfdf5" delay={0.82} style={{ position: 'fixed', right: '4%', top: '35%', zIndex: 100 }} />
          <FeaturePill icon={<FileText size={16} />} text="One-Click Reporting" color="#0ea5e9" bg="#f0f9ff" delay={1.06} style={{ position: 'fixed', right: '2%', top: '70%', zIndex: 100 }} />

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "relative", zIndex: 2, marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}
          >
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} style={{ width: 13, height: 13 }} viewBox="0 0 20 20" fill="#fbbf24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: "0.78rem", color: "#c7d2fe", fontStyle: "italic" }}>
              "ZorvynFin cut our reconciliation time by 60%. The role controls are exactly what we needed."
            </p>
            <p style={{ fontSize: "0.72rem", color: "#818cf8", marginTop: 6, fontWeight: 600 }}>— Finance Lead, Veritas Capital</p>
          </motion.div>
        </div>

        {/* ── RIGHT: Signup Form ── */}
        <div
          style={{
            flex: 1, background: "#fff", padding: "2.5rem 2.25rem",
            display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto"
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Integrated Logo for both Mobile/Desktop */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={18} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#4f46e5", letterSpacing: '-0.02em' }}>ZorvynFin</span>
            </div>

            <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "#0f172a", marginBottom: 6, fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.01em' }}>Create your account</h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: 28 }}>Complete the setup to access your dashboard</p>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", fontSize: "0.84rem" }}
                >
                  <svg style={{ width: 15, height: 15, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Email */}
              <div>
                <label htmlFor="su-email" style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  id="su-email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  style={{
                    display: "block", width: "100%", height: 40, borderRadius: 9,
                    border: `1.5px solid ${fieldErrors.email ? "#f87171" : "#e5e7eb"}`,
                    background: "#f9fafb", padding: "0 12px", fontSize: "0.875rem", color: "#111827",
                    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = fieldErrors.email ? "#f87171" : "#e5e7eb"}
                />
                {fieldErrors.email && (
                  <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: 5 }}>{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="su-password" style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Create password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="su-password" type={showPassword ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters" autoComplete="new-password"
                    aria-invalid={!!fieldErrors.password}
                    style={{
                      display: "block", width: "100%", height: 40, borderRadius: 9,
                      border: `1.5px solid ${fieldErrors.password ? "#f87171" : "#e5e7eb"}`,
                      background: "#f9fafb", padding: "0 40px 0 12px", fontSize: "0.875rem", color: "#111827",
                      outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = fieldErrors.password ? "#f87171" : "#e5e7eb"}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 10, top: 0, bottom: 0, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: 5 }}>{fieldErrors.password}</p>
                )}
              </div>

              {/* Role selector — card style */}
              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  Select your role
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ROLES.map((r) => (
                    <label
                      key={r.value}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                        borderRadius: 12, cursor: "pointer", transition: "all 0.25s ease",
                        border: `2px solid ${role === r.value ? "#4f46e5" : "#f1f5f9"}`,
                        background: role === r.value ? "#f8faff" : "#fff",
                        boxShadow: role === r.value ? "0 4px 20px rgba(79,70,229,0.08)" : "none"
                      }}
                    >
                      <input
                        type="radio" name="role" value={r.value}
                        checked={role === r.value} onChange={() => setRole(r.value)}
                        style={{ display: "none" }}
                      />
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: role === r.value ? "#4f46e5" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: role === r.value ? "#fff" : "#64748b", flexShrink: 0, transition: 'all 0.2s' }}>
                        {r.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: role === r.value ? "#1e1b4b" : "#334155", marginBottom: 1 }}>{r.label}</p>
                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{r.desc}</p>
                      </div>
                      {role === r.value && (
                        <div style={{ padding: 4, background: '#4f46e5', borderRadius: '50%' }}>
                          <CheckCircle2 size={12} color="#fff" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit" disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  position: "relative", overflow: "hidden", width: "100%", height: 44,
                  borderRadius: 11, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "#fff", fontSize: "0.92rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 8px 24px rgba(79,70,229,0.35)",
                  opacity: isLoading ? 0.65 : 1, marginTop: 12
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <> Create account <ArrowRight size={16} /> </>
                )}
              </motion.button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.84rem", color: "#6b7280", marginTop: 18 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default ZorvynSignup;
