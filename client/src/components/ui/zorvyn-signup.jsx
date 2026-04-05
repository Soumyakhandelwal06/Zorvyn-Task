import { useState, useEffect } from "react";
import { BarChart3, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Users, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// ─── Animated Finance Background for left panel ───────────────────────────────
const FinanceBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    {/* Dot grid */}
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
      <defs>
        <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#a5b4fc" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>

    {/* Floating glow orbs */}
    <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)", top: -60, left: -60 }} />
    <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", bottom: 80, right: -40 }} />

    {/* Mini bar chart decoration */}
    <div style={{ position: "absolute", bottom: 100, left: 32, display: "flex", alignItems: "flex-end", gap: 6, opacity: 0.35 }}>
      {[44, 62, 48, 78, 56, 88, 72].map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
          style={{ width: 10, height: h * 0.7, borderRadius: "3px 3px 0 0", background: i % 2 === 0 ? "#818cf8" : "#6ee7b7", transformOrigin: "bottom" }}
        />
      ))}
    </div>

    {/* Trend line SVG decoration */}
    <svg style={{ position: "absolute", bottom: 60, left: 24, opacity: 0.3 }} width="120" height="40" viewBox="0 0 120 40">
      <motion.polyline
        points="0,35 20,25 40,28 60,16 80,12 100,6 120,2"
        fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1.2 }}
      />
    </svg>
  </div>
);

// ─── Feature pill ─────────────────────────────────────────────────────────────
const FeaturePill = ({ icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.45 }}
    style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.1)" }}
  >
    <span style={{ color: "#a5b4fc" }}>{icon}</span>
    <span style={{ color: "#e0e7ff", fontSize: "0.82rem", fontWeight: 500 }}>{text}</span>
  </motion.div>
);

// ─── Role Option ──────────────────────────────────────────────────────────────
const ROLES = [
  { value: "VIEWER", label: "Viewer", desc: "View reports & dashboards", icon: <Eye size={14} /> },
  { value: "ANALYST", label: "Analyst", desc: "Add & manage transactions", icon: <TrendingUp size={14} /> },
  { value: "ADMIN", label: "Admin", desc: "Full access & user management", icon: <ShieldCheck size={14} /> },
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
        justifyContent: "center", padding: 16, overflowY: "auto",
        backgroundColor: '#fafbff',
        backgroundImage: [
          'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
          'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.13) 0%, transparent 60%)',
          'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(139,92,246,0.10) 0%, transparent 55%)',
          'radial-gradient(ellipse 50% 40% at 10% 80%, rgba(16,185,129,0.07) 0%, transparent 50%)',
        ].join(', '),
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: '-1px -1px, -1px -1px, center, center, center',
      }}
    >
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
              style={{ fontSize: "1.55rem", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.02em" }}
            >
              The smart finance platform for modern businesses
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ fontSize: "0.84rem", color: "#a5b4fc", lineHeight: 1.65, marginBottom: 28 }}
            >
              Track income, expenses &amp; net balance in real-time. Role-based control so every team member sees just what they need.
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FeaturePill icon={<TrendingUp size={14} />} text="Real-Time Financial Dashboard" delay={0.7} />
              <FeaturePill icon={<ShieldCheck size={14} />} text="Role-Based Access Control" delay={0.82} />
              <FeaturePill icon={<Users size={14} />} text="Multi-User Team Management" delay={0.94} />
              <FeaturePill icon={<CheckCircle2 size={14} />} text="Audit Logs &amp; CSV Export" delay={1.06} />
            </div>
          </div>

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
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#4f46e5" }}>ZorvynFin</span>
            </div>

            {/* Orange accent icon */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(249,115,22,0.35)", marginBottom: 14 }}>
                <BarChart3 size={20} color="#fff" />
              </div>
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
                        borderRadius: 10, cursor: "pointer", transition: "all 0.18s",
                        border: `1.5px solid ${role === r.value ? "#6366f1" : "#e5e7eb"}`,
                        background: role === r.value ? "#eef2ff" : "#f9fafb"
                      }}
                    >
                      <input
                        type="radio" name="role" value={r.value}
                        checked={role === r.value} onChange={() => setRole(r.value)}
                        style={{ display: "none" }}
                      />
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: role === r.value ? "#e0e7ff" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: role === r.value ? "#4f46e5" : "#9ca3af", flexShrink: 0 }}>
                        {r.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.84rem", fontWeight: 700, color: role === r.value ? "#4338ca" : "#374151", marginBottom: 1 }}>{r.label}</p>
                        <p style={{ fontSize: "0.74rem", color: "#6b7280" }}>{r.desc}</p>
                      </div>
                      {role === r.value && (
                        <CheckCircle2 size={16} color="#4f46e5" />
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
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "#fff", fontSize: "0.92rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
                  opacity: isLoading ? 0.65 : 1, marginTop: 4
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
