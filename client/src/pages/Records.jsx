import React from 'react';
import RecordTable from '../components/RecordTable';
import { FileText } from 'lucide-react';

const Records = () => {
  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText size={32} color="var(--primary-color)" />
          <div>
            <h1>Financial Records</h1>
            <p style={{ color: 'var(--text-secondary)' }}>View, search, and manage all your detailed transactions here.</p>
          </div>
        </div>
      </div>
      
      <RecordTable />
    </div>
  );
};

export default Records;
