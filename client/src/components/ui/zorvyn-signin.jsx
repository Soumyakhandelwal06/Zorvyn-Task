import React, { useRef, useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, BarChart3, ShieldCheck, TrendingUp, FileText } from "lucide-react";
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

    const drawGrid = () => {
      const gap = 22;
      for (let x = gap; x < width; x += gap) {
        for (let y = gap; y < height; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(79, 70, 229, 0.12)";
          ctx.fill();
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / 2.5, 1);

      drawGrid();

      const chartTop = height * 0.32;
      const chartBottom = height * 0.75;
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
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

// ─── Floating KPI Badge ───────────────────────────────────────────────────────
const KPIBadge = ({ icon, label, value, color, delay, style }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.82 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.45 }}
    style={{ position: "absolute", zIndex: 20, ...style }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2"
  >
    <div className="p-1.5 rounded-lg" style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium leading-none" style={{ marginBottom: 3 }}>{label}</p>
      <p className="text-sm font-bold leading-none" style={{ color }}>{value}</p>
    </div>
  </motion.div>
);

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

          {/* Floating badges */}
          <KPIBadge icon={<TrendingUp size={13} color="#10b981" />} label="Net Balance" value="+$2,800" color="#10b981" delay={0.8} style={{ top: 18, right: 16 }} />
          <KPIBadge icon={<TrendingUp size={13} color="#4f46e5" />} label="Revenue" value="+32%" color="#4f46e5" delay={1.05} style={{ bottom: 76, left: 14 }} />
          <KPIBadge icon={<ShieldCheck size={13} color="#f59e0b" />} label="Audit Score" value="98%" color="#f59e0b" delay={1.3} style={{ bottom: 18, right: 16 }} />

          {/* Brand overlay — top centre */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, paddingTop: 32, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(79,70,229,0.3)", marginBottom: 12 }}>
              <BarChart3 size={22} color="#fff" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: "1.5rem", fontWeight: 800 }}>
              <span style={{ color: '#4f46e5' }}>Zorvyn</span><span style={{ color: '#0f172a' }}>Fin</span>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              style={{ fontSize: "0.8rem", color: "#64748b", textAlign: "center", maxWidth: 180, marginTop: 6, fontWeight: 500 }}>
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

            <p style={{ textAlign: "center", fontSize: "0.84rem", color: "#6b7280", marginTop: 18 }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>Create account</Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ZorvynSignIn;
