import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

interface Report {
  id: number;
  header: string;
  body: string;
  username: string;
  category_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

function AdminLaporan() {
  const [reports, setReports] = useState<Report[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await API.put(`/reports/${id}/status`, { status });
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus laporan ini?')) return;
    try {
      await API.delete(`/reports/${id}`);
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    if (status === 'approved') return '#27ae60';
    if (status === 'rejected') return '#e74c3c';
    return '#f39c12';
  };

  const getStatusText = (status: string) => {
    if (status === 'approved') return 'Disetujui';
    if (status === 'rejected') return 'Ditolak';
    return 'Menunggu';
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>PPMM Admin</h2>
        <div style={styles.navRight}>
          <Link to="/admin/kategori" style={styles.navLink}>Kelola Kategori</Link>
          {user?.role === 'super_admin' && (
            <Link to="/superadmin/users" style={styles.navLink}>Kelola User</Link>
          )}
          <span style={styles.welcome}>Halo, {user?.username}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Kelola Laporan</h3>
        {reports.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.empty}>Belum ada laporan.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h4 style={styles.cardTitle}>{report.header}</h4>
                <span style={{ ...styles.badge, backgroundColor: getStatusColor(report.status) }}>
                  {getStatusText(report.status)}
                </span>
              </div>
              <p style={styles.cardBody}>{report.body.substring(0, 100)}...</p>
              <p style={styles.meta}>Oleh: {report.username} | {report.category_name}</p>
              <div style={styles.cardFooter}>
                <div style={styles.btnGroup}>
                  <button style={styles.approveBtn} onClick={() => handleStatus(report.id, 'approved')}>✓ Setujui</button>
                  <button style={styles.rejectBtn} onClick={() => handleStatus(report.id, 'rejected')}>✗ Tolak</button>
                  <button style={styles.pendingBtn} onClick={() => handleStatus(report.id, 'pending')}>↺ Pending</button>
                </div>
                <div style={styles.btnGroup}>
                  <Link to={`/report/${report.id}`} style={styles.detailBtn}>Detail</Link>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(report.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#fff5f5', fontFamily: "'Segoe UI', sans-serif" },
  navbar: { backgroundColor: '#f48fb1', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  navTitle: { color: 'white', margin: 0, fontSize: '20px', fontWeight: '600' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  navLink: { color: 'white', textDecoration: 'none', fontSize: '14px', padding: '6px 12px', borderRadius: '20px', border: '1px solid white' },
  welcome: { color: 'white', fontSize: '14px' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  content: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  sectionTitle: { marginBottom: '1.5rem', color: '#333', fontSize: '18px', fontWeight: '600' },
  emptyContainer: { textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '16px' },
  empty: { color: '#aaa', fontSize: '14px' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '1rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  cardTitle: { margin: 0, color: '#333', fontSize: '16px', fontWeight: '600' },
  badge: { color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  cardBody: { color: '#888', fontSize: '14px', marginBottom: '0.5rem', lineHeight: '1.6' },
  meta: { fontSize: '12px', color: '#aaa', marginBottom: '1rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  btnGroup: { display: 'flex', gap: '8px' },
  approveBtn: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  rejectBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  pendingBtn: { backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  detailBtn: { backgroundColor: '#f48fb1', color: 'white', padding: '6px 14px', borderRadius: '20px', textDecoration: 'none', fontSize: '12px' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }
};

export default AdminLaporan;