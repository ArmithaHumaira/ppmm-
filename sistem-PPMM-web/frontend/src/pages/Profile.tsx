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

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const initials = user?.username?.substring(0, 2).toUpperCase() || 'U';

  useEffect(() => {
    if (!isAdmin) fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await API.get('/reports');
      const myReports = res.data.filter((r: Report) => r.username === user?.username);
      setReports(myReports);
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

  const getRoleText = (role: string) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return 'Masyarakat';
  };

  const total = reports.length;
  const menunggu = reports.filter(r => r.status === 'pending').length;
  const disetujui = reports.filter(r => r.status === 'approved').length;
  const ditolak = reports.filter(r => r.status === 'rejected').length;

  const UserSidebar = () => (
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
        <Link to="/dashboard" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Beranda</span>
        </Link>
        <Link to="/add-report" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Buat Laporan</span>
        </Link>
        <Link to="/semua-laporan" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span>Semua Laporan</span>
        </Link>
        <Link to="/riwayat" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Riwayat Saya</span>
        </Link>
        <div style={styles.navItemActive}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Profil</span>
        </div>
      </nav>
      <div style={styles.sidebarFooter}>
        <div style={{ ...styles.userInfo, cursor: 'pointer' }}>
          <div style={styles.avatarSmall}>{initials}</div>
          <div>
            <p style={styles.userName}>{user?.username}</p>
            <p style={styles.userRole}>User</p>
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
  );

  const AdminSidebar = () => (
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
        <Link to="/admin/dashboard" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/laporan" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Kelola Laporan</span>
        </Link>
        {isSuperAdmin && (
          <Link to="/superadmin/users" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <span>Kelola User</span>
          </Link>
        )}
        <Link to="/admin/kategori" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span>Kelola Kategori</span>
        </Link>
        <Link to="/admin/logs" style={styles.navItemLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Log Aktivitas</span>
        </Link>
        <div style={styles.navItemActive}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Profil</span>
        </div>
      </nav>
      <div style={styles.sidebarFooter}>
        <div style={{ ...styles.userInfo, cursor: 'pointer' }}>
          <div style={styles.avatarSmall}>{initials}</div>
          <div>
            <p style={styles.userName}>{user?.username}</p>
            <p style={styles.userRole}>{getRoleText(user?.role || '')}</p>
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
  );

  return (
    <div style={styles.container}>
      {isAdmin ? <AdminSidebar /> : <UserSidebar />}

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div style={styles.avatar}>{initials}</div>
        </div>

        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.profileHeaderInner}>
            <div style={styles.editBtn} onClick={() => {}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span style={styles.editText}>Edit Profil</span>
            </div>
            <div style={styles.avatarXL}>{initials}</div>
            <h2 style={styles.profileName}>{user?.username}</h2>
            <p style={styles.profileEmail}>{user?.email || '-'}</p>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Informasi Pribadi */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Informasi Pribadi</h3>
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <p style={styles.infoText}>{user?.email || '-'}</p>
              </div>
              <div style={styles.infoItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <p style={styles.infoText}>@{user?.username}</p>
              </div>
              <div style={styles.infoItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p style={styles.infoText}>Bergabung sejak -</p>
              </div>
              <div style={styles.infoItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{ ...styles.rolePill }}>{getRoleText(user?.role || '')}</span>
              </div>
            </div>
          </div>

          {/* Statistik Laporan */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Statistik Laporan</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                </svg>
                <p style={styles.statNum}>{total}</p>
                <p style={styles.statLabel}>Total Laporan</p>
              </div>
              <div style={styles.statItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <p style={{ ...styles.statNum, color: '#f39c12' }}>{menunggu}</p>
                <p style={styles.statLabel}>Menunggu</p>
              </div>
              <div style={styles.statItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <p style={{ ...styles.statNum, color: '#27ae60' }}>{disetujui}</p>
                <p style={styles.statLabel}>Disetujui</p>
              </div>
              <div style={styles.statItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <p style={{ ...styles.statNum, color: '#e74c3c' }}>{ditolak}</p>
                <p style={styles.statLabel}>Ditolak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Laporan Saya */}
        <div style={styles.section}>
          <h3 style={styles.cardTitle}>Laporan Saya</h3>
          {reports.length === 0 ? (
            <p style={styles.empty}>Belum ada laporan.</p>
          ) : (
            reports.slice(0, 5).map((report) => (
              <Link to={`/report/${report.id}`} key={report.id} style={styles.reportItem}>
                <div>
                  <p style={styles.reportTitle}>{report.header}</p>
                  <p style={styles.reportMeta}>{report.category_name} • {new Date(report.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(report.status) + '20', color: getStatusColor(report.status) }}>
                  {getStatusText(report.status)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#fff5f5', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '180px', backgroundColor: 'white', padding: '1.2rem 1rem', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.05)', flexShrink: 0 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.8rem' },
  logoIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f48fb1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoTitle: { margin: 0, fontSize: '13px', fontWeight: '600', color: '#333' },
  logoSub: { margin: 0, fontSize: '10px', color: '#aaa' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#fff0f5', color: '#f48fb1', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  navItemLink: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', color: '#888', fontSize: '13px', textDecoration: 'none' },
  sidebarFooter: { borderTop: '1px solid #f5f5f5', paddingTop: '1rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '6px 8px', borderRadius: '10px' },
  avatarSmall: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  userName: { margin: 0, fontSize: '12px', fontWeight: '500', color: '#333' },
  userRole: { margin: 0, fontSize: '10px', color: '#aaa' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#888', fontSize: '13px', cursor: 'pointer', width: '100%' },
  main: { flex: 1, padding: '1.2rem 1.5rem', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  profileHeader: { backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', position: 'relative' },
  profileHeaderInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  editBtn: { position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' },
  editText: { fontSize: '12px', color: '#f48fb1' },
  avatarXL: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '600' },
  profileName: { margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' },
  profileEmail: { margin: 0, fontSize: '13px', color: '#aaa' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' },
  card: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  cardTitle: { margin: '0 0 1rem', fontSize: '14px', fontWeight: '600', color: '#333' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  infoText: { margin: 0, fontSize: '13px', color: '#555' },
  rolePill: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#fff0f5', color: '#f48fb1', fontWeight: '500' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0.8rem', backgroundColor: '#f9f9f9', borderRadius: '12px' },
  statNum: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' },
  statLabel: { margin: 0, fontSize: '11px', color: '#aaa' },
  section: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  empty: { color: '#aaa', fontSize: '13px', textAlign: 'center' },
  reportItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9f9f9', textDecoration: 'none' },
  reportTitle: { margin: '0 0 2px', fontSize: '13px', fontWeight: '500', color: '#333' },
  reportMeta: { margin: 0, fontSize: '11px', color: '#aaa' },
  statusBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }
};

export default Profile;