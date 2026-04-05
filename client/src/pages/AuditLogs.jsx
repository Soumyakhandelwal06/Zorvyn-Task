import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection on frontend, actual protection handles it in backend
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
    } else {
      fetchLogs();
    }
  }, [user, navigate]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/audit');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Audit Logs...</div>;
  }

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={32} color="var(--primary-color)" />
          <div>
            <h1>System Audit Logs</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Read-only tracking of all state-mutating actions.</p>
          </div>
        </div>
      </div>

      <div className="saas-card">
        {logs.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No audit logs found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="record-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>User Email</th>
                  <th>Record ID</th>
                  <th>Old Data</th>
                  <th>New Data</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>
                      <span className="badge" style={{ 
                        background: log.action === 'DELETE' ? 'rgba(248, 113, 113, 0.2)' : 
                                    log.action === 'CREATE' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(250, 204, 21, 0.2)',
                        color: log.action === 'DELETE' ? 'var(--error-color)' : 
                               log.action === 'CREATE' ? 'var(--success-color)' : 'var(--secondary-color)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.user?.email || 'System'}</td>
                    <td><code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>{log.resourceId}</code></td>
                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.oldData || '-'}>
                      {log.oldData || '-'}
                    </td>
                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.newData || '-'}>
                      {log.newData || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
