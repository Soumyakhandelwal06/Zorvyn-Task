import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { z } from 'zod';

const recordSchema = z.object({
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(2, "Category must be at least 2 characters"),
  description: z.string().optional()
});

const CreateRecordModal = ({ onClose, onRecordCreated }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Zod validation
    try {
      const parsedData = recordSchema.parse({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setErrors({});
      
      setLoading(true);
      await axios.post('http://localhost:5001/api/records', parsedData);
      toast.success('Record created skillfully!');
      onRecordCreated();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = {};
        error.errors.forEach(err => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(error);
        toast.error('Failed to create record');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: '400px', backgroundColor: 'var(--surface-color)' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Entry</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount</label>
            <input 
              type="number" 
              className="input-field" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
            />
            {errors.amount && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>{errors.amount}</span>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
            <select 
              className="input-field"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            {errors.type && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>{errors.type}</span>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="E.g., Groceries, Salary, Rent"
            />
            {errors.category && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>{errors.category}</span>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description (Optional)</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Details about this record..."
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRecordModal;
