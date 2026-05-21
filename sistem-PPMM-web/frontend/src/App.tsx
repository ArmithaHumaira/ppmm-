import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddReport from './pages/AddReport';
import DetailReport from './pages/DetailReport';
import AdminLaporan from './pages/AdminLaporan';
import AdminKategori from './pages/AdminKategori';
import SuperAdminUsers from './pages/SuperAdminUsers';

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
          <Rou