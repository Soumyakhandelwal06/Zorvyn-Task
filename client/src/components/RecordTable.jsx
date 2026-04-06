import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Filter } from 'lucide-react';
import EditRecordModal from './EditRecordModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Pagination from './Pagination';
import PriceRangeSlider from './PriceRangeSlider';

const RecordTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(10000); // Default, will sync from backend
  const [debouncedMinAmount, setDebouncedMinAmount] = useState(0);
  const [debouncedMaxAmount, setDebouncedMaxAmount] = useState(10000);
  const [maxAmountEver, setMaxAmountEver] = useState(10000);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce effect for price slider
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinAmount(minAmount);
      setDebouncedMaxAmount(maxAmount);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [minAmount, maxAmount]);

  const { user } = useAuth();
  
  useEffect(() => {
    setPage(1); // Reset to first page when filtering
  }, [filterType, filterCategory, debouncedMinAmount, debouncedMaxAmount]);

  useEffect(() => {
    fetchRecords();
  }, [filterType, filterCategory, page, debouncedMinAmount, debouncedMaxAmount]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterType) params.type = filterType;
      if (filterCategory) params.category = filterCategory;
      if (debouncedMinAmount !== undefined && debouncedMinAmount !== '') params.minAmount = debouncedMinAmount;
      if (debouncedMaxAmount !== undefined && debouncedMaxAmount !== '') params.maxAmount = debouncedMaxAmount;
      
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/records', { 
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data.data);
      setTotalPages(res.data.totalPages);
      if (res.data.maxAmountEver) {
        setMaxAmountEver(res.data.maxAmountEver);
        // On first load, sync maxAmount filter to global max
        if (maxAmount === 10000) {
          setMaxAmount(res.data.maxAmountEver);
        }
      }
    } catch (error) {
      console.error('Failed to fetch records', error);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/records/${recordToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Filter size={20} color="var(--primary-color)" /> Financial Records
        </h3>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginRight: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Amount:</span>
            <PriceRangeSlider 
              min={0}
              max={maxAmountEver}
              minVal={minAmount}
              maxVal={maxAmount}
              onChange={(low, high) => {
                setMinAmount(low);
                setMaxAmount(high);
              }}
            />
          </div>

          <div className="filter-group">
            <div className="filter-select-wrapper">
              <Filter className="filter-icon" size={14} />
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            
            <div className="filter-select-wrapper">
              <Database className="filter-icon" size={14} />
              <select 
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Dividends">Dividends</option>
                <option value="Rent">Rent</option>
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Dining">Dining</option>
                <option value="Transport">Transport</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
          </div>
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
              <AnimatePresence mode="wait">
                {records?.map((record) => (
                  <motion.tr 
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {!loading && records.length > 0 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={(p) => setPage(p)} 
        />
      )}
    </div>
  );
};

export default RecordTable;
