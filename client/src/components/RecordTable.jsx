import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Filter } from 'lucide-react';
import EditRecordModal from './EditRecordModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const RecordTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  
  useEffect(() => {
    fetchRecords();
  }, [filterType, filterCategory]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterCategory) params.category = filterCategory;
      
      const res = await axios.get('http://localhost:5001/api/records', { params });
      setRecords(res.data);
    } catch (error) {
      console.error('Failed to fetch records', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5001/api/records/${recordToDelete}`);
      toast.success("Record deleted");
      fetchRecords();
      setRecordToDelete(null);
    } catch (error) {
      console.error('Failed to delete record', error);
      toast.error("Failed to delete record");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRecordUpdated = () => {
    fetchRecords();
    window.location.reload(); // To ensure dashboard aggregates also refresh
  };

  return (
    <div className="saas-card" style={{ marginTop: '2rem' }}>
      {editingRecord && (
        <EditRecordModal 
          record={editingRecord} 
          onClose={() => setEditingRecord(null)} 
          onRecordUpdated={handleRecordUpdated} 
        />
      )}
      
      {recordToDelete && (
        <DeleteConfirmModal 
          onClose={() => setRecordToDelete(null)}
          onConfirm={confirmDelete}
          loading={isDeleting}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={20} color="var(--primary-color)" /> Financial Records
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.5rem' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          
          <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.5rem' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Groceries">Groceries</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No records found. Click '+ Add Record' to begin track tracking your finances.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="record-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                {user?.role === 'ADMIN' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <motion.tr 
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                >
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${record.type.toLowerCase()}`}>
                      {record.type}
                    </span>
                  </td>
                  <td>{record.category}</td>
                  <td>{record.description || '-'}</td>
                  <td style={{ 
                    color: record.type === 'INCOME' ? 'var(--success-color)' : 'var(--error-color)',
                    fontWeight: 'bold'
                  }}>
                    ${record.amount.toFixed(2)}
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      <button 
                        onClick={() => setEditingRecord(record)}
                        className="btn-primary"
                        style={{ marginRight: '0.5rem', width: 'auto', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => setRecordToDelete(record.id)}
                        className="btn-delete"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecordTable;
