import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, UserIcon, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

const UsersPanel = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setPage(1);
  }, [searchEmail, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [page, searchEmail, filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (searchEmail) params.email = searchEmail;
      if (filterRole) params.role = filterRole;

      const res = await axios.get(`/api/auth/users`, { params });
      setUsersList(res.data.data);
      setTotalPages(res.data.totalPages);
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
      await axios.put(`/api/auth/users/${id}/role`, { role: newRole });
      toast.success('User role updated successfully');
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role');
      fetchUsers(); // reset UI on fail
    }
  };

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

      <div className="saas-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search user email..." 
              style={{ paddingLeft: '2.5rem', background: 'rgba(255, 255, 255, 0.03)' }}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <div className="filter-select-wrapper" style={{ minWidth: '160px' }}>
              <UserIcon className="filter-icon" size={14} />
              <select 
                className="filter-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="ANALYST">ANALYST</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>
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
            <AnimatePresence mode="wait">
              {usersList?.map((u) => (
                <motion.tr 
                  key={u.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
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
            </AnimatePresence>
          </tbody>
        </table>

        {!loading && usersList.length > 0 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => setPage(p)} 
          />
        )}
      </div>
    </div>
  );
};

export default UsersPanel;
