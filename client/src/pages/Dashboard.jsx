import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { ShieldCheck, LogOut, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Label,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const COLORS = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// ─── Custom Animated Dot for Charts ──────────────────────────────────────────
const AnimatedDot = (props) => {
  const { cx, cy, stroke, fill, index } = props;
  return (
    <motion.circle
      key={`dot-${index}`} // Stable key ensures animation only plays once on mount
      cx={cx}
      cy={cy}
      r={5}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
        delay: 0.6 + (index * 0.1) // Increased delay to pop in as line draws
      }}
    />
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };

      const summaryRes = await axios.get('/api/dashboard/summary', config);
      const trendsRes = await axios.get('/api/dashboard/trends', config);
      
      setSummary(summaryRes.data);
      
      // Ensure frontend sorting as a failsafe
      const sorted = (trendsRes.data || []).sort((a, b) => (a.sortKey || '').localeCompare(b.sortKey || ''));
      setTrends(sorted);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <DashboardSkeleton />;
  }

  const categoryData = summary?.categoryTotals.map(item => ({
    name: item.category,
    value: item._sum.amount
  })) || [];

  const barData = summary?.categoryTotals.map(item => ({
    name: item.category,
    amount: item._sum.amount,
    type: item.type
  })) || [];

  const trendDataWithNet = trends.map(item => ({
    ...item,
    net: item.income - item.expense
  }));

  const totalCategoryAmount = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>

      
      <div className="page-header">
        <div className="page-title">
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.4rem', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', fontWeight: 500 }}>Welcome back! Here's your financial summary.</p>
          {summary?.smartInsight && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              style={{ marginTop: '0.8rem', padding: '0.5rem 1rem', background: '#e0e7ff', borderLeft: '4px solid var(--primary-color)', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--primary-color)' }}
            >
              ✨ {summary.smartInsight}
            </motion.div>
          )}
        </div>
        <div className="page-actions">

        </div>
      </div>

      {/* Summary Cards (Refined Fintech Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="saas-card" style={{ position: 'relative', display: 'block', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', padding: '2rem' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
             <TrendingUp size={20} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '800', letterSpacing: '0.1em' }}>CASH FLOW</span>
          <h2 style={{ color: '#0f172a', marginTop: '0.5rem', fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            ${(summary?.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Inward cash flow</div>
        </div>

        <div className="saas-card" style={{ position: 'relative', display: 'block', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', padding: '2rem' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
             <TrendingDown size={20} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '800', letterSpacing: '0.1em' }}>EXPENSES</span>
          <h2 style={{ color: '#0f172a', marginTop: '0.5rem', fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            ${(summary?.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Outward payments</div>
        </div>

        <div className="saas-card" style={{ position: 'relative', display: 'block', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', padding: '2rem' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
             <DollarSign size={20} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: '800', letterSpacing: '0.1em' }}>PROFIT & LOSS</span>
          <h2 style={{ color: '#0f172a', marginTop: '0.5rem', fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            ${summary?.netBalance < 0 ? '-' : ''}{Math.abs(summary?.netBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Net corporate balance</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="saas-card" style={{ height: '360px' }}>
          <div className="saas-card-header">CATEGORY BREAKDOWN</div>
          <div style={{ position: 'relative', width: '100%', height: '90%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="35%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {/* Hub text perfectly centered relative to the visually offset pie hole */}
                <text
                  x="26%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#111827"
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}
                  dy={10} // Bringing it down slightly as requested
                >
                  ${totalCategoryAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </text>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    color: '#111827',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                  itemStyle={{ color: '#111827', fontWeight: '500', fontSize: '0.85rem' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '0.85rem', color: '#4b5563', paddingRight: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="saas-card" style={{ height: '360px' }}>
          <div className="saas-card-header">6-MONTH TRENDS</div>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '6px', 
                  border: '1px solid #e5e7eb',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '0.85rem'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                activeDot={{ r: 8 }} 
                dot={<AnimatedDot fill="#fff" stroke="#10b981" />} 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                activeDot={{ r: 8 }} 
                dot={<AnimatedDot fill="#fff" stroke="#ef4444" />} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="saas-card" style={{ height: '360px' }}>
          <div className="saas-card-header">CATEGORY VOLUME</div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <RechartsTooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="amount" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
                isAnimationActive={true}
                animationDuration={1500}
                animationBegin={200}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'INCOME' ? '#10b981' : '#4f46e5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="saas-card" style={{ height: '360px' }}>
          <div className="saas-card-header">NET PROFITABILITY</div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trendDataWithNet} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={<AnimatedDot fill="#6366f1" stroke="#fff" />} 
                activeDot={{ r: 8 }}
                isAnimationActive={true}
                animationDuration={1500}
                animationBegin={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
