import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Database, Clock, User, Search, Eye } from 'lucide-react';
import Pagination from '../components/Pagination';
import AuditDetailModal from '../components/AuditDetailModal';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState('');
  const [searchResourceId, setSearchResourceId] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset to first page when filtering
    setPage(1);
  }, [filterAction, searchResourceId]);

  useEffect(() => {
    // Basic protection on frontend, actual protection handles it in backend
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
    } else {
      fetchLogs();
    }
  }, [user, navigate, page, filterAction, searchResourceId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterAction) params.action = filterAction;
      if (searchResourceId) params.resourceId = searchResourceId;
      
      const res = await axios.get(`/audit`, { params });
      setLogs(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <AuditDetailModal 
        log={selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />

      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={32} color="var(--primary-color)" />
          <div>
            <h1>System Audit Logs</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Read-only tracking of all state-mutating actions.</p>
          </div>
        </div>
      </div>

      <div className="saas-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search Resource ID..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchResourceId}
              onChange={(e) => setSearchResourceId(e.target.value)}
            />
          </div>
          <select 
            className="input-field" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="saas-card" style={{ textAlign: 'center', padding: '3rem' }}>
          No audit logs found.
        </div>
      ) : (
        <div className="saas-card" style={{ overflowX: 'auto' }}>
          <table className="record-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User</th>
                <th>Resource ID</th>
                <th>Change Detail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {logs?.map((log) => (
                  <motion.tr 
                    key={log.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>
                      <span className="badge" style={{ 
                        background: log.action === 'CREATE' ? 'rgba(16, 185, 129, 0.15)' : 
                                    log.action === 'UPDATE' ? 'rgba(79, 70, 229, 0.15)' : 
                                    'rgba(239, 68, 68, 0.15)',
                        color: log.action === 'CREATE' ? 'var(--success-color)' : 
                               log.action === 'UPDATE' ? 'var(--primary-color)' : 
                               'var(--error-color)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={14} /> {log.user?.email || 'System'}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                        {log.resourceId.substring(0, 8)}...
                      </code>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.action === 'UPDATE' ? 'Modified fields: ' : log.action === 'CREATE' ? 'New entry' : 'Entry removed'}
                      {log.oldData && ` ${Object.keys(JSON.parse(log.oldData)).slice(0, 2).join(', ')}...`}
                    </td>
                    <td>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.40rem', fontSize: '0.85rem' }}
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
