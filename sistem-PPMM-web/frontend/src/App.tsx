import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import AddReport from './pages/user/AddReport';
import DetailReport from './pages/user/DetailReport';
import SemuaLaporan from './pages/user/SemuaLaporan';
import Riwayat from './pages/user/Riwayat';
import Laporan from './pages/admin/Laporan';
import Kategori from './pages/admin/Kategori';
import Users from './pages/admin/Users';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogs from './pages/admin/Logs';
import Profile from './pages/Profile';
import AdminProfile from './pages/admin/Profile';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user && (user.role === 'admin' || user.role === 'super_admin')
    ? <>{children}</>
    : <Navigate to="/login" />;
};

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user && user.role === 'super_admin'
    ? <>{children}</>
    : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-report" element={<PrivateRoute><AddReport /></PrivateRoute>} />
          <Route path="/report/:id" element={<PrivateRoute><DetailReport /></PrivateRoute>} />
          <Route path="/semua-laporan" element={<PrivateRoute><SemuaLaporan /></PrivateRoute>} />
          <Route path="/riwayat" element={<PrivateRoute><Riwayat /></PrivateRoute>} />
          <Route path="/admin/laporan" element={<AdminRoute><Laporan /></AdminRoute>} />
          <Route path="/admin/kategori" element={<AdminRoute><Kategori /></AdminRoute>} />
          <Route path="/superadmin/users" element={<SuperAdminRoute><Users /></SuperAdminRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/logs" element={<AdminRoute><AdminLogs /></AdminRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><Profile /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;