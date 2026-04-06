import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Clock, User, ArrowRight } from 'lucide-react';

const AuditDetailModal = ({ log, onClose }) => {
  if (!log) return null;

  const oldData = log.oldData ? JSON.parse(log.oldData) : null;
  const newData = log.newData ? JSON.parse(log.newData) : null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '800px', width: '90%' }}
        >
          <div className="modal-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
              <Database size={24} color="var(--primary-color)" />
              Audit Log Detail
            </h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="detail-item">
                <span className="detail-label"><Clock size={14} /> Timestamp</span>
                <p className="detail-value">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <span className="detail-label">Action</span>
                <p>
                  <span className="badge" style={{ 
                    background: log.action === 'CREATE' ? 'rgba(16, 185, 129, 0.1)' : 
                                log.action === 'UPDATE' ? 'rgba(79, 70, 229, 0.1)' : 
                                'rgba(239, 68, 68, 0.1)',
                    color: log.action === 'CREATE' ? 'var(--success-color)' : 
                           log.action === 'UPDATE' ? 'var(--primary-color)' : 
                           'var(--error-color)'
                  }}>
                    {log.action}
                  </span>
                </p>
              </div>
              <div className="detail-item">
                <span className="detail-label"><User size={14} /> Performed By</span>
                <p className="detail-value">{log.user?.email || 'System'}</p>
              </div>
              <div className="detail-item">
                <span className="detail-label">Resource ID</span>
                <p className="detail-value" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{log.resourceId}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: log.oldData && log.newData ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              {oldData && (
                <div>
                  <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Original State
                  </h4>
                  <div className="json-viewer">
                    <pre>{JSON.stringify(oldData, null, 2)}</pre>
                  </div>
                </div>
              )}
              {newData && (
                <div>
                  <h4 style={{ marginBottom: '0.75rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    New State {oldData && <ArrowRight size={14} />}
                  </h4>
                  <div className="json-viewer" style={{ borderLeft: oldData ? '2px solid var(--primary-color)' : 'none' }}>
                    <pre>{JSON.stringify(newData, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Close Overview</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuditDetailModal;
