import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, UserIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UsersPanel = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/users');
      setUsersList(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    // Prevent admin from removing their own admin status easily if testing.
    if (id === user.id && newRole !== 'ADMIN') {
      const confirmed = window.confirm("Warning: You are changing your OWN role. You will lose admin access.");
      if (!confirmed) return fetchUsers(); // reset UI
    }

    try {
      await axios.put(`http://localhost:5001/api/auth/users/${id}/role`, { role: newRole });
      toast.success('User role updated successfully');
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role');
      fetchUsers(); // reset UI on fail
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Users...</div>;

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users size={32} color="var(--primary-color)" />
          <div>
            <h1>User Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage platform access and roles.</p>
          </div>
        </div>
      </div>

      <div className="saas-card" style={{ overflowX: 'auto' }}>
        <table className="record-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Access Role</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.id.substring(0, 8)}...</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserIcon size={16} color="var(--primary-color)" /> {u.email}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <select 
                    className="input-field" 
                    style={{ width: '150px', padding: '0.5rem' }}
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="VIEWER">VIEWER</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPanel;
