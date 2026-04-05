import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import AuditLogs from './pages/AuditLogs';
import UsersPanel from './pages/UsersPanel';
import Landing from './pages/Landing';
import DashboardLayout from './components/layout/DashboardLayout';

const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading } = useAuth();
  
  if (!user && !loading) return <Navigate to="/login" replace />;
  if (requireRole && user?.role !== requireRole) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
            <Route 
              path="/audit" 
              element={<ProtectedRoute requireRole="ADMIN"><AuditLogs /></ProtectedRoute>} 
            />
            <Route 
              path="/users" 
              element={<ProtectedRoute requireRole="ADMIN"><UsersPanel /></ProtectedRoute>} 
            />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
