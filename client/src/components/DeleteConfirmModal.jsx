import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ onClose, onConfirm, loading }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div 
        className="saas-card"
        style={{ width: '100%', maxWidth: '400px', padding: '2rem', margin: '0 1rem', position: 'relative' }}
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
      >
        <button onClick={onClose} className="btn-close" style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="var(--text-secondary)" />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <AlertTriangle size={32} color="#ef4444" />
          </div>
          
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Delete Record</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Are you sure you want to permanently delete this financial record? This action cannot be undone and will immediately affect your dashboard aggregates.
          </p>

          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary" 
              style={{ flex: 1, padding: '0.75rem' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={onConfirm} 
              className="btn-delete" 
              style={{ flex: 1, padding: '0.75rem', background: '#ef4444', color: '#fff', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Record'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;
