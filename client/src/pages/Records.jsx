import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import RecordTable from '../components/RecordTable';
import { FileText, PlusCircle, Download } from 'lucide-react';
import CreateRecordModal from '../components/CreateRecordModal';

const Records = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleExportCSV = async () => {
    try {
      const res = await axios.get('/api/records/export', { responseType: 'blob' });
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
    // Reload the table data
    window.location.reload(); 
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      {showAddModal && <CreateRecordModal onClose={() => setShowAddModal(false)} onRecordCreated={handleRecordAdded} />}
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
            <FileText size={24} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.1rem', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Financial Records</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>View, search, and manage all your detailed transactions here.</p>
          </div>
        </div>

        <div className="page-actions" style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn-primary" 
              style={{ background: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600 }}
            >
              <PlusCircle size={18} /> Add Record
            </button>
          )}
          {(user?.role === 'ADMIN' || user?.role === 'ANALYST' || user?.role === 'VIEWER') && (
            <button 
              onClick={handleExportCSV} 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600, background: '#fff', border: '1px solid #e2e8f0' }}
            >
              <Download size={18} /> Export CSV
            </button>
          )}
        </div>
      </div>
      
      <RecordTable />
    </div>
  );
};

export default Records;
