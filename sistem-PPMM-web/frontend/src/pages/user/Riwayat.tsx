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
  image: string | null;
}

function Riwayat() {
  const [reports, setReports] = useState<Report[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyReports();
    const interval = setInterval(() => {
      fetchMyReports();
    }, 5000);
    return () => clearInterval(interval);
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

  const initials = user?.username?.substring(0, 2).toUpperCase() || 'U';
  const total = reports.length;
  const menunggu = reports.filter(r => r.status === 'pending').length;
  const disetujui = reports.filter(r => r.status === 'approved').length;
  const ditolak = reports.filter(r => r.status === 'rejected').length;

  return (
    <div style={styles.container}>
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
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
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
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Riwayat Saya</span>
          </div>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
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

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>Riwayat Saya</h2>
            <p style={styles.headerSub}>Laporan yang pernah kamu buat</p>
          </div>
          <div style={styles.avatar}>{initials}</div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statNum}>{total}</p>
            <p style={styles.statLabel}>Total</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNum, color: '#f39c12' }}>{menunggu}</p>
            <p style={styles.statLabel}>Menunggu</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNum, color: '#27ae60' }}>{disetujui}</p>
            <p style={styles.statLabel}>Disetujui</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNum, color: '#e74c3c' }}>{ditolak}</p>
            <p style={styles.statLabel}>Ditolak</p>
          </div>
        </div>

        <div style={styles.section}>
          <p style={styles.countText}>{total} laporan kamu</p>
          {reports.length === 0 ? (
            <div style={styles.emptyContainer}>
              <p style={styles.empty}>Kamu belum pernah membuat laporan.</p>
              <Link to="/add-report" style={styles.addBtn}>+ Buat Laporan Sekarang</Link>
            </div>
          ) : (
            reports.map((report) => (
              <Link to={`/report/${report.id}`} key={report.id} style={styles.reportCard}>
                <div style={styles.reportImg}>
                  {report.image ? (
                    <img src={`http://localhost:5000/uploads/${report.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>
                <div style={styles.reportInfo}>
                  <p style={styles.reportTitle}>{report.header}</p>
                  <p style={styles.reportBody}>{report.body.substring(0, 80)}...</p>
                  <div style={styles.reportMeta}>
                    <span style={styles.categoryTag}>{report.category_name}</span>
                    <span style={{ ...styles.statusTag, backgroundColor: getStatusColor(report.status) + '20', color: getStatusColor(report.status) }}>
                      {getStatusText(report.status)}
                    </span>
                    <span style={styles.dateTag}>{new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1.2rem' },
  statCard: { backgroundColor: 'white', padding: '0.8rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' },
  statNum: { margin: '0 0 2px', fontSize: '20px', fontWeight: '600', color: '#333' },
  statLabel: { margin: 0, fontSize: '11px', color: '#aaa' },
  section: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  countText: { fontSize: '12px', color: '#aaa', margin: '0 0 1rem' },
  emptyContainer: { textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  empty: { color: '#aaa', fontSize: '13px', margin: 0 },
  addBtn: { backgroundColor: '#f48fb1', color: 'white', padding: '10px 20px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: '500' },
  reportCard: { display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f9f9f9', textDecoration: 'none', alignItems: 'flex-start' },
  reportImg: { width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  reportInfo: { flex: 1 },
  reportTitle: { margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#333' },
  reportBody: { margin: '0 0 6px', fontSize: '12px', color: '#888', lineHeight: '1.5' },
  reportMeta: { display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' },
  categoryTag: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: '#f5f5f5', color: '#888' },
  statusTag: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' },
  dateTag: { fontSize: '11px', color: '#bbb' }
};

export default Riwayat;