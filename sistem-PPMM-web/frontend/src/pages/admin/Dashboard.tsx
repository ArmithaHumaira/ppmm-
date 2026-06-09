import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

interface Report {
  id: number;
  header: string;
  body: string;
  username: string;
  category_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface User {
  id: number;
  username: string;
  role: string;
}

function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    fetchUsers();
    const interval = setInterval(() => {
      fetchReports();
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchReports = async () => {
    try {
      const res = await API.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
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

  const totalUser = users.filter(u => u.role === 'user').length;
  const totalAdmin = users.filter(u => u.role === 'admin').length;
  const totalSuperAdmin = users.filter(u => u.role === 'super_admin').length;
  const totalLaporan = reports.length;
  const menunggu = reports.filter(r => r.status === 'pending').length;

  const initials = user?.username?.substring(0, 2).toUpperCase() || 'SA';

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <p style={styles.logoTitle}>LaporKu</p>
            <p style={styles.logoSub}>Sistem Pelaporan</p>
          </div>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </div>
          <Link to="/admin/laporan" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Kelola Laporan</span>
          </Link>
          <Link to="/superadmin/users" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Kelola User</span>
          </Link>
          <Link to="/admin/kategori" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <span>Kelola Kategori</span>
          </Link>
        </nav>

        <div style={styles.sidebarFooter}>
        <div style={{ ...styles.userInfo, cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
            <div style={styles.avatarSmall}>{initials}</div>
            <div>
              <p style={styles.userName}>{user?.username}</p>
              <p style={styles.userRole}>Super Admin</p>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>Dashboard Super Admin</h2>
            <p style={styles.headerSub}>Pengelolaan sistem dan monitoring penuh</p>
          </div>
          <div style={styles.avatar}>{initials}</div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#e8f5e9' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <p style={styles.statNum}>{totalUser}</p>
            <p style={styles.statLabel}>Total User</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#e3f2fd' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p style={styles.statNum}>{totalAdmin}</p>
            <p style={styles.statLabel}>Admin</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#f3e5f5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b59b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
            </div>
            <p style={styles.statNum}>{totalSuperAdmin}</p>
            <p style={styles.statLabel}>Super Admin</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#fff3e0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p style={styles.statNum}>{totalLaporan}</p>
            <p style={styles.statLabel}>Total Laporan</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#fff8e1' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p style={styles.statNum}>{menunggu}</p>
            <p style={styles.statLabel}>Menunggu</p>
          </div>
        </div>

        {/* Bottom Grid */}
        <div style={styles.bottomGrid}>
          {/* Laporan Terbaru */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Laporan Terbaru</h3>
              <Link to="/admin/laporan" style={styles.lihatSemua}>Lihat semua</Link>
            </div>
            {reports.length === 0 ? (
              <p style={styles.empty}>Belum ada laporan.</p>
            ) : (
              reports.slice(0, 4).map((report) => (
                <Link to={`/report/${report.id}`} key={report.id} style={styles.reportItem}>
                  <div style={styles.reportItemLeft}>
                    <p style={styles.reportItemTitle}>{report.header.substring(0, 30)}...</p>
                    <p style={styles.reportItemMeta}>{report.username} • {new Date(report.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <span style={{ ...styles.badge, backgroundColor: getStatusColor(report.status) + '20', color: getStatusColor(report.status) }}>
                    {getStatusText(report.status)}
                  </span>
                </Link>
              ))
            )}
          </div>

          {/* Riwayat Aktivitas */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Riwayat Aktivitas</h3>
              <Link to="/admin/laporan" style={styles.lihatSemua}>Lihat semua</Link>
            </div>
            {reports.slice(0, 4).map((report, index) => (
              <div key={report.id} style={styles.activityItem}>
                <div style={{ ...styles.activityDot, backgroundColor: index === 0 ? '#27ae60' : index === 1 ? '#f48fb1' : index === 2 ? '#3498db' : '#9b59b6' }} />
                <div>
                  <p style={styles.activityText}>
                    {report.status === 'approved' ? 'Laporan disetujui' : report.status === 'rejected' ? 'Laporan ditolak' : 'Laporan baru masuk'}
                  </p>
                  <p style={styles.activityMeta}>{report.username} • {new Date(report.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div style={styles.quickGrid}>
          <Link to="/superadmin/users" style={styles.quickCard}>
            <div style={{ ...styles.quickIcon, backgroundColor: '#e8f5e9' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <p style={styles.quickTitle}>Kelola User</p>
            <p style={styles.quickSub}>CRUD semua user</p>
          </Link>
          <Link to="/admin/kategori" style={styles.quickCard}>
            <div style={{ ...styles.quickIcon, backgroundColor: '#fce4ec' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </div>
            <p style={styles.quickTitle}>Kelola Kategori</p>
            <p style={styles.quickSub}>Tambah & hapus</p>
          </Link>
          <Link to="/admin/laporan" style={styles.quickCard}>
            <div style={{ ...styles.quickIcon, backgroundColor: '#e3f2fd' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p style={styles.quickTitle}>Kelola Laporan</p>
            <p style={styles.quickSub}>Kelola semua laporan</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#fff5f5', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '160px', backgroundColor: 'white', padding: '1rem 0.8rem', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.05)', flexShrink: 0 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' },
  logoIcon: { width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#f48fb1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoTitle: { margin: 0, fontSize: '12px', fontWeight: '600', color: '#333' },
  logoSub: { margin: 0, fontSize: '10px', color: '#aaa' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#fff0f5', color: '#f48fb1', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  navItemLink: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', color: '#888', fontSize: '13px', textDecoration: 'none' },
  sidebarFooter: { borderTop: '1px solid #f5f5f5', paddingTop: '1rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  avatarSmall: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  userName: { margin: 0, fontSize: '13px', fontWeight: '500', color: '#333' },
  userRole: { margin: 0, fontSize: '11px', color: '#aaa' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#888', fontSize: '13px', cursor: 'pointer', width: '100%' },
  main: { flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  headerTitle: { margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#333' },
  headerSub: { margin: 0, fontSize: '12px', color: '#aaa' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem', marginBottom: '1.2rem' },
  statCard: { backgroundColor: 'white', padding: '0.8rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' },
  statIcon: { width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' },
  statNum: { margin: '0 0 2px', fontSize: '20px', fontWeight: '600', color: '#333' },
  statLabel: { margin: 0, fontSize: '10px', color: '#aaa' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  section: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' },
  lihatSemua: { fontSize: '12px', color: '#f48fb1', textDecoration: 'none' },
  empty: { color: '#aaa', fontSize: '13px', textAlign: 'center' },
  reportItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f9f9f9', textDecoration: 'none' },
  reportItemLeft: {},
  reportItemTitle: { margin: '0 0 2px', fontSize: '12px', fontWeight: '500', color: '#333' },
  reportItemMeta: { margin: 0, fontSize: '11px', color: '#aaa' },
  badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' },
  activityItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f9f9f9' },
  activityDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '4px', flexShrink: 0 },
  activityText: { margin: '0 0 2px', fontSize: '12px', fontWeight: '500', color: '#333' },
  activityMeta: { margin: 0, fontSize: '11px', color: '#aaa' },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  quickCard: { backgroundColor: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' },
  quickIcon: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' },
  quickTitle: { margin: 0, fontSize: '13px', fontWeight: '600', color: '#333' },
  quickSub: { margin: 0, fontSize: '11px', color: '#aaa' }
};

export default AdminDashboard;