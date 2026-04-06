import React, { useRef, useEffect, useState } from "react";
import { 
  Eye, EyeOff, ArrowRight, BarChart3, ShieldCheck, TrendingUp, FileText,
  Wallet, Coins, Banknote, Landmark, Calculator, RefreshCcw, CheckCircle2,
  CreditCard, PiggyBank, Receipt, DollarSign, PieChart, Tag, Search, TrendingDown,
  Briefcase, CircleDollarSign, Percent, ClipboardList, Scale, Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// ─── Animated Finance Canvas ──────────────────────────────────────────────────
// Uses explicit pixel dimensions (no ResizeObserver → no growth loop)
const FinanceCanvas = ({ width = 420, height = 540 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const bars = [
      { label: "Jan", income: 0.55, expense: 0.3 },
      { label: "Feb", income: 0.65, expense: 0.38 },
      { label: "Mar", income: 0.48, expense: 0.42 },
      { label: "Apr", income: 0.75, expense: 0.35 },
      { label: "May", income: 0.68, expense: 0.28 },
      { label: "Jun", income: 0.82, expense: 0.4 },
    ];

    const trendPoints = [
      { x: 0.08, y: 0.72 }, { x: 0.22, y: 0.58 }, { x: 0.38, y: 0.64 },
      { x: 0.52, y: 0.44 }, { x: 0.68, y: 0.38 }, { x: 0.82, y: 0.28 }, { x: 0.92, y: 0.22 },
    ];

    let rafId;
    const startTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / 2.5, 1);

      const chartTop = height * 0.46;
      const chartBottom = height * 0.85;
      const chartH = chartBottom - chartTop;
      const barZoneW = width * 0.84;
      const barZoneX = width * 0.08;
      const barW = (barZoneW / bars.length) * 0.27;
      const gap = barZoneW / bars.length;

      bars.forEach((bar, i) => {
        const x = barZoneX + i * gap;
        const incH = chartH * bar.income * progress;
        const expH = chartH * bar.expense * progress;

        const incGrad = ctx.createLinearGradient(0, chartBottom - incH, 0, chartBottom);
        incGrad.addColorStop(0, "rgba(79, 70, 229, 0.9)");
        incGrad.addColorStop(1, "rgba(79, 70, 229, 0.25)");
        ctx.fillStyle = incGrad;
        ctx.beginPath();
        ctx.roundRect(x, chartBottom - incH, barW, incH, [4, 4, 0, 0]);
        ctx.fill();

        const expGrad = ctx.createLinearGradient(0, chartBottom - expH, 0, chartBottom);
        expGrad.addColorStop(0, "rgba(239, 68, 68, 0.75)");
        expGrad.addColorStop(1, "rgba(239, 68, 68, 0.18)");
        ctx.fillStyle = expGrad;
        ctx.beginPath();
        ctx.roundRect(x + barW + 5, chartBottom - expH, barW, expH, [4, 4, 0, 0]);
        ctx.fill();

        ctx.fillStyle = "rgba(107, 114, 128, 0.75)";
        ctx.font = "bold 8.5px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(bar.label, x + barW, chartBottom + 14);
      });

      // Trend line
      ctx.beginPath();
      const visibleCount = Math.floor(trendPoints.length * progress);
      const partialProgress = (trendPoints.length * progress) % 1;

      trendPoints.slice(0, visibleCount + 1).forEach((pt, i) => {
        const px = pt.x * width, py = pt.y * height;
        const next = trendPoints[Math.min(i + 1, trendPoints.length - 1)];
        const nx = i < visibleCount ? px : px + (next.x * width - px) * partialProgress;
        const ny = i < visibleCount ? py : py + (next.y * height - py) * partialProgress;
        if (i === 0) ctx.moveTo(nx, ny); else ctx.lineTo(nx, ny);
      });
      ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.stroke();

      if (visibleCount < trendPoints.length) {
        const cur = trendPoints[visibleCount];
        const nxt = trendPoints[Math.min(visibleCount + 1, trendPoints.length - 1)];
        const dx = cur.x * width + (nxt.x * width - cur.x * width) * partialProgress;
        const dy = cur.y * height + (nxt.y * height - cur.y * height) * partialProgress;
        ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = "#10b981"; ctx.fill();
        ctx.beginPath(); ctx.arc(dx, dy, 10, 0, Math.PI * 2); ctx.fillStyle = "rgba(16,185,129,0.22)"; ctx.fill();
      }

      const legendY = chartTop - 18;
      [["#4f46e5", "Income"], ["#ef4444", "Expense"], ["#10b981", "Trend"]].forEach(([color, label], i) => {
        const lx = width * 0.08 + i * 68;
        ctx.beginPath(); ctx.arc(lx, legendY, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
        ctx.fillStyle = "rgba(55, 65, 81, 0.8)"; ctx.font = "bold 9px Inter, sans-serif";
        ctx.textAlign = "left"; ctx.fillText(label, lx + 8, legendY + 4);
      });

      ctx.beginPath();
      ctx.moveTo(width * 0.06, chartBottom); ctx.lineTo(width * 0.94, chartBottom);
      ctx.strokeStyle = "rgba(229, 231, 235, 0.6)"; ctx.lineWidth = 1; ctx.stroke();

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [width, height]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Cross grid pattern background */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
        <defs>
          <pattern id="grid-signin" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-signin)" />
      </svg>
      
      <div style={{ position: "absolute", width: "100%", height: "100%", background: "radial-gradient(circle at 50% 50%, rgba(165,180,252,0.1) 0%, rgba(255,255,255,0) 100%)" }} />

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", position: "relative", zIndex: 1 }}
      />
    </div>
  );
};

// ─── Floating KPI Badge ───────────────────────────────────────────────────────
const KPIBadge = ({ icon, label, value, color, delay, style, isVivid }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.82, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
    style={{ 
      position: "absolute", zIndex: 20, ...style,
      background: isVivid ? color : "#fff",
      color: isVivid ? "#fff" : "#111827",
      borderRadius: 12, padding: '10px 16px',
      boxShadow: isVivid ? `0 8px 20px ${color}33` : "0 8px 24px rgba(0,0,0,0.06)",
      display: 'flex', alignItems: 'center', gap: 10,
      border: isVivid ? 'none' : '1px solid rgba(0,0,0,0.04)'
    }}
  >
    <div style={{ padding: 6, borderRadius: 8, background: isVivid ? 'rgba(255,255,255,0.2)' : `${color}15` }}>
      {React.cloneElement(icon, { color: isVivid ? '#fff' : color })}
    </div>
    <div>
      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: isVivid ? 'rgba(255,255,255,0.85)' : '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
      <p style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0 }}>{value}</p>
    </div>
  </motion.div>
);

// ─── Floating Background Icons ───────────────────────────────────────────────
const FloatingBackgroundIcons = () => {
  const icons = [
    { Icon: Wallet, top: '5%', left: '4%', delay: 0, color: '#4f46e5' },
    { Icon: PiggyBank, top: '15%', right: '6%', delay: 1, color: '#f59e0b' },
    { Icon: Landmark, bottom: '12%', left: '5%', delay: 2, color: '#10b981' },
    { Icon: CreditCard, bottom: '20%', right: '4%', delay: 3, color: '#4f46e5' },
    { Icon: Calculator, top: '45%', left: '3%', delay: 0.5, color: '#6366f1' },
    { Icon: Receipt, top: '35%', right: '2%', delay: 1.5, color: '#10b981' },
    { Icon: Coins, bottom: '40%', right: '5%', delay: 2.5, color: '#f59e0b' },
    { Icon: Banknote, top: '75%', left: '2%', delay: 1.2, color: '#10b981' },
    { Icon: DollarSign, top: '25%', left: '2%', delay: 0.7, color: '#4f46e5' },
    { Icon: PieChart, top: '55%', right: '3%', delay: 1.8, color: '#6366f1' },
    { Icon: Tag, bottom: '30%', left: '4%', delay: 2.4, color: '#10b981' },
    { Icon: Search, top: '10%', right: '4%', delay: 1.1, color: '#f59e0b' },
    { Icon: TrendingDown, bottom: '15%', right: '2%', delay: 2.9, color: '#ef4444' },
    { Icon: FileText, top: '85%', right: '6%', delay: 1.6, color: '#6366f1' },
    { Icon: Briefcase, top: '40%', right: '5%', delay: 0.9, color: '#4f46e5' },
    { Icon: CircleDollarSign, bottom: '45%', left: '3%', delay: 2.1, color: '#10b981' },
    { Icon: Percent, top: '65%', left: '1%', delay: 1.3, color: '#f59e0b' },
    { Icon: ClipboardList, bottom: '5%', right: '4%', delay: 2.7, color: '#6366f1' },
    { Icon: Scale, top: '20%', right: '1.5%', delay: 0.4, color: '#10b981' },
    { Icon: Globe, bottom: '25%', right: '5%', delay: 3.2, color: '#4f46e5' },
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

// ─── Main Sign-In Component ───────────────────────────────────────────────────
const ZorvynSignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login("admin@zorvyn.com", "admin123");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Demo login failed. Check connection.");
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
      <FloatingBackgroundIcons />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%", maxWidth: 900, height: 560,
          borderRadius: 24, overflow: "hidden",
          display: "flex", background: "#fff",
          boxShadow: "0 25px 50px -12px rgba(79,70,229,0.15), 0 0 0 1px rgba(226,232,240,0.8)"
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          style={{
            width: "47%", position: "relative", overflow: "hidden", flexShrink: 0,
            background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 60%, #c7d2fe 100%)",
            borderRight: "1px solid #e5e7eb"
          }}
          className="hidden md:block"
        >
          {/* Canvas fills exactly the panel */}
          <div style={{ position: "absolute", inset: 0 }}>
            <FinanceCanvas width={420} height={560} />
          </div>

          {/* Floating and Separated KPI Badges – Positioned organically at sides */}
          {/* LEFT SIDE */}
          <KPIBadge icon={<RefreshCcw size={14} />} label="Accounting" value="Hub" color="#f59e0b" delay={0.8} style={{ position: 'fixed', left: '4%', top: '15%', zIndex: 100 }} isVivid />
          <KPIBadge icon={<ShieldCheck size={14} />} label="Security" value="System" color="#6366f1" delay={1} style={{ position: 'fixed', left: '2%', top: '42%', zIndex: 100 }} isVivid />
          <KPIBadge icon={<Receipt size={14} />} label="Invoices" value="12 Paid" color="#4f46e5" delay={1.2} style={{ position: 'fixed', left: '5%', top: '70%', zIndex: 100 }} />

          {/* RIGHT SIDE */}
          <KPIBadge icon={<TrendingUp size={14} />} label="Growth" value="+32%" color="#10b981" delay={0.9} style={{ position: 'fixed', right: '6%', top: '25%', zIndex: 100 }} />
          <KPIBadge icon={<ShieldCheck size={14} />} label="Compliance" value="98%" color="#4f46e5" delay={1.1} style={{ position: 'fixed', right: '3%', top: '65%', zIndex: 100 }} />

          {/* Brand overlay — top centre */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, paddingTop: 56, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(79,70,229,0.35)", marginBottom: 16 }}>
              <BarChart3 size={24} color="#fff" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: "1.75rem", fontWeight: 800, fontFamily: "'DM Serif Display', serif" }}>
              <span style={{ color: '#4f46e5' }}>Zorvyn</span><span style={{ color: '#0f172a' }}>Fin</span>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              style={{ fontSize: "0.875rem", color: "#64748b", textAlign: "center", maxWidth: 220, marginTop: 8, fontWeight: 500, lineHeight: 1.5 }}>
              Precision finance tracking with real-time technical insights
            </motion.p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, padding: "2.5rem 2.75rem", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-5 md:hidden">
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#4f46e5" }}>ZorvynFin</span>
            </div>

            <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "#0f172a", marginBottom: 6, fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.01em' }}>Welcome back</h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: 32 }}>Access your secure finance dashboard</p>

            {/* Error banner */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", fontSize: "0.84rem" }}>
                <svg style={{ width: 15, height: 15, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Email */}
              <div>
                <label htmlFor="lp-email" style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Email <span style={{ color: "#4f46e5" }}>*</span>
                </label>
                <input
                  id="lp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com" required autoComplete="email"
                  style={{ display: "block", width: "100%", height: 40, borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "0 12px", fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#6d28d9"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label htmlFor="lp-password" style={{ fontSize: "0.84rem", fontWeight: 600, color: "#374151" }}>
                    Password <span style={{ color: "#4f46e5" }}>*</span>
                  </label>
                  <a href="#" style={{ fontSize: "0.75rem", color: "#4f46e5", textDecoration: "none" }}>Forgot password?</a>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="lp-password" type={isPasswordVisible ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password"
                    style={{ display: "block", width: "100%", height: 40, borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "0 40px 0 12px", fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#6d28d9"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                  <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{ position: "absolute", right: 10, top: 0, bottom: 0, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}>
                    {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit" disabled={isLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
                style={{
                  position: "relative", overflow: "hidden", width: "100%", height: 42,
                  borderRadius: 10, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                  background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
                  color: "#fff", fontSize: "0.9rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: isHovered ? "0 8px 24px rgba(79,70,229,0.4)" : "0 3px 12px rgba(79,70,229,0.25)",
                  opacity: isLoading ? 0.65 : 1, transition: "box-shadow 0.25s", marginTop: 4
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <> Sign in <ArrowRight size={16} /> </>
                )}
                {isHovered && !isLoading && (
                  <motion.span
                    initial={{ left: "-100%" }} animate={{ left: "150%" }}
                    transition={{ duration: 0.85, ease: "easeInOut" }}
                    style={{ position: "absolute", top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", filter: "blur(5px)", pointerEvents: "none" }}
                  />
                )}
              </motion.button>
            </form>

            {/* Trust indicators */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#9ca3af", marginBottom: 12 }}>Protected by enterprise-grade security</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                {[
                  { icon: <ShieldCheck size={13} color="#4f46e5" />, label: "JWT Auth" },
                  { icon: <FileText size={13} color="#4f46e5" />, label: "Audit Logs" },
                  { icon: <BarChart3 size={13} color="#4f46e5" />, label: "RBAC" },
                ].map((f) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#6b7280" }}>
                    {f.icon} {f.label}
                  </div>
                ))}
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.84rem", color: "#6b7280", marginTop: 24 }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>Create account</Link>
            </p>

            {/* Admin Demo Quick Access */}
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Demo Access</span>
                <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
              </div>

              <motion.button
                onClick={handleDemoLogin}
                type="button"
                whileHover={{ scale: 1.01, backgroundColor: "#f8faff" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%", height: 42, borderRadius: 10, border: "2px solid #e2e8f0",
                  background: "#fff", color: "#475569", fontSize: "0.88rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <ShieldCheck size={16} color="#4f46e5" />
                Login as Admin (Demo)
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ZorvynSignIn;
