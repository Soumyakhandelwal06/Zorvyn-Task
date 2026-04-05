import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { PlusCircle, ShieldCheck, Download, LogOut, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Label } from 'recharts';
import CreateRecordModal from '../components/CreateRecordModal';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const COLORS = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await axios.get('http://localhost:5001/api/dashboard/summary');
      const trendsRes = await axios.get('http://localhost:5001/api/dashboard/trends');
      setSummary(summaryRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/records/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'financial_records.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV", error);
      toast.error("Failed to export CSV. Ensure you have permissions.");
    }
  };

  const handleRecordAdded = () => {
    fetchDashboardData();
    window.location.reload(); 
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const categoryData = summary?.categoryTotals.map(item => ({
    name: item.category,
    value: item._sum.amount
  })) || [];

  const totalCategoryAmount = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      {showAddModal && <CreateRecordModal onClose={() => setShowAddModal(false)} onRecordCreated={handleRecordAdded} />}
      
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
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn-primary" 
              style={{ background: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={18} /> Add Record
            </button>
          )}
          {(user?.role === 'ADMIN' || user?.role === 'ANALYST') && (
            <button 
              onClick={handleExportCSV} 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={18} /> Export CSV
            </button>
          )}
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
            {/* Absolute positioning bound specifically to cx="35%" and cy="50%" of the container */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '35%', 
              transform: 'translate(-50%, -50%)', 
              pointerEvents: 'none', 
              zIndex: 10,
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              ${totalCategoryAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
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
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 8 }} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" activeDot={{ r: 8 }} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
