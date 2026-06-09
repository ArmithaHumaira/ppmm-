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

function AdminLaporan() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    const interval = setInterval(() => {
      fetchReports();
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

  const handleStatus = async (id: number, status: string) => {
    try {
      await API.put(`/reports/${id}/status`, { status });
      await API.post('/logs', {
        action: status === 'approved' ? 'Menyetujui laporan' : status === 'rejected' ? 'Menolak laporan' : 'Mengubah status laporan',
        target: `Laporan #${id}`,
        action_type: 'status_change'
      });
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus laporan ini?')) return;
    try {
      await API.delete(`/reports/${id}`);
      await API.post('/logs', {
        action: 'Menghapus laporan',
        target: `Laporan #${id}`,
        action_type: 'delete'
      });
      fetchReports();
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

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const initials = user?.username?.substring(0, 2).toUpperCase() || 'A';

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
          <Link to="/admin/dashboard" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            <span>Dashboard</span>
          </Link>
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Kelola Laporan</span>
          </div>
          
          <Link to="/admin/kategori" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <span>Kelola Kategori</span>
          </Link>

          <Link to="/superadmin/users" style={styles.navItemLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <span>Kelola User</span>
            </Link>
        </nav>
        <div style={styles.sidebarFooter}>
        <div style={{ ...styles.userInfo, cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
            <div style={styles.avatarSmall}>{initials}</div>
            <div>
              <p style={styles.userName}>{user?.username}</p>
              <p style={styles.userRole}>Super Admin</p>
            </div>
            <span style={styles.chevron}>›</span>
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
        <div style={styles.topBar}>
          <div style={styles.avatar}>{initials}</div>
        </div>

        <div style={styles.pageHeader}>
          <h2 style={styles.headerTitle}>Kelola Laporan</h2>
          <p style={styles.headerSub}>Akses penuh ke semua laporan di sistem</p>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {[
            { key: 'all', label: `Semua (${reports.length})` },
            { key: 'pending', label: `Menunggu (${reports.filter(r => r.status === 'pending').length})` },
            { key: 'approved', label: `Disetujui (${reports.filter(r => r.status === 'approved').length})` },
            { key: 'rejected', label: `Ditolak (${reports.filter(r => r.status === 'rejected').length})` },
          ].map(tab => (
            <button
              key={tab.key}
              style={{ ...styles.filterTab, ...(filter === tab.key ? styles.filterTabActive : {}) }}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Laporan</th>
                <th style={styles.th}>Pelapor</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyTd}>Belum ada laporan.</td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.idText}>#{report.id}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.reportCell}>
                        <div style={styles.reportThumb}>
                          {report.image ? (
                            <img src={`http://localhost:5000/uploads/${report.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p style={styles.reportTitle}>{report.header.substring(0, 28)}...</p>
                          <p style={styles.reportCat}>{report.category_name}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdText}>{report.username}</p>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(report.status) + '20', color: getStatusColor(report.status) }}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdText}>{new Date(report.created_at).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td style={styles.td}>
                    <div style={styles.actionGroup}>
                          <button
                            style={{ ...styles.actionBtn, backgroundColor: '#e8f5e9' }}
                            onClick={() => handleStatus(report.id, 'approved')}
                            title="Setujui"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                          <button
                            style={{ ...styles.actionBtn, backgroundColor: '#fff8e1' }}
                            onClick={() => handleStatus(report.id, 'rejected')}
                            title="Tolak"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                          <button
                            style={{ ...styles.actionBtn, backgroundColor: '#fdecea' }}
                            onClick={() => handleDelete(report.id)}
                            title="Hapus"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            </svg>
                          </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
  chevron: { marginLeft: 'auto', color: '#ccc', fontSize: '16px' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#888', fontSize: '13px', cursor: 'pointer', width: '100%' },
  main: { flex: 1, padding: '1.2rem 1.5rem', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  pageHeader: { marginBottom: '1.2rem' },
  headerTitle: { margin: '0 0 4px', fontSize: '20px', fontWeight: '600', color: '#333' },
  headerSub: { margin: 0, fontSize: '12px', color: '#aaa' },
  filterTabs: { display: 'flex', gap: '8px', marginBottom: '1rem' },
  filterTab: { padding: '7px 16px', borderRadius: '20px', border: '1px solid #eee', backgroundColor: 'white', fontSize: '12px', cursor: 'pointer', color: '#888', fontWeight: '400' },
  filterTabActive: { backgroundColor: '#f48fb1', color: 'white', border: '1px solid #f48fb1', fontWeight: '500' },
  tableCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { backgroundColor: '#fafafa' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#bbb', fontWeight: '500', borderBottom: '1px solid #f5f5f5' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle' },
  emptyTd: { padding: '3rem', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  idText: { fontSize: '12px', color: '#bbb', fontWeight: '500' },
  reportCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  reportThumb: { width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  reportTitle: { margin: '0 0 2px', fontSize: '13px', fontWeight: '500', color: '#333' },
  reportCat: { margin: 0, fontSize: '11px', color: '#f48fb1' },
  tdText: { margin: 0, fontSize: '13px', color: '#555' },
  statusBadge: { fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: '500' },
  actionGroup: { display: 'flex', gap: '6px', alignItems: 'center' },
  actionBtn: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#e3f2fd', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default AdminLaporan;