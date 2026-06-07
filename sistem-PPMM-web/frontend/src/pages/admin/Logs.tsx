import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

interface Log {
  id: number;
  user_id: number;
  username: string;
  action: string;
  target: string;
  action_type: 'create' | 'update' | 'delete' | 'status_change';
  created_at: string;
}

function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/logs');
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getActionColor = (type: string) => {
    if (type === 'create') return '#27ae60';
    if (type === 'update') return '#f39c12';
    if (type === 'delete') return '#e74c3c';
    return '#f48fb1';
  };

  const getActionIcon = (type: string) => {
    if (type === 'create') return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    );
    if (type === 'delete') return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
      </svg>
    );
    if (type === 'update') return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    );
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    );
  };

  const initials = user?.username?.substring(0, 2).toUpperCase() || 'A';

  const totalCreate = logs.filter(l => l.action_type === 'create').length;
  const totalUpdate = logs.filter(l => l.action_type === 'update').length;
  const totalDelete = logs.filter(l => l.action_type === 'delete').length;
  const totalStatus = logs.filter(l => l.action_type === 'status_change').length;

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
          <Link to="/admin/laporan" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Kelola Laporan</span>
          </Link>
          <Link to="/superadmin/users" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <span>Kelola User</span>
          </Link>
          <Link to="/admin/kategori" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <span>Kelola Kategori</span>
          </Link>
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Log Aktivitas</span>
          </div>
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
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
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>Log Aktivitas Sistem</h2>
            <p style={styles.headerSub}>Catatan semua aktivitas user, admin, dan super admin</p>
          </div>
          <div style={styles.avatar}>{initials}</div>
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Aksi</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Target</th>
                <th style={styles.th}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={styles.emptyTd}>Belum ada log aktivitas.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        <div style={{ ...styles.actionDot, backgroundColor: getActionColor(log.action_type) }}>
                          {getActionIcon(log.action_type)}
                        </div>
                        <p style={styles.actionText}>{log.action}</p>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdText}>{log.username}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdTarget}>{log.target}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdText}>{new Date(log.created_at).toLocaleString('id-ID')}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statDot, backgroundColor: '#27ae60' }} />
            <p style={styles.statNum}>{totalCreate}</p>
            <p style={styles.statLabel}>Create</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statDot, backgroundColor: '#f39c12' }} />
            <p style={styles.statNum}>{totalUpdate}</p>
            <p style={styles.statLabel}>Update</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statDot, backgroundColor: '#e74c3c' }} />
            <p style={styles.statNum}>{totalDelete}</p>
            <p style={styles.statLabel}>Delete</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statDot, backgroundColor: '#f48fb1' }} />
            <p style={styles.statNum}>{totalStatus}</p>
            <p style={styles.statLabel}>Status Change</p>
          </div>
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
  tableCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#aaa', fontWeight: '500', borderBottom: '1px solid #f5f5f5' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle' },
  emptyTd: { padding: '2rem', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  actionCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  actionDot: { width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  actionText: { margin: 0, fontSize: '13px', fontWeight: '500', color: '#333' },
  tdText: { margin: 0, fontSize: '13px', color: '#555' },
  tdTarget: { margin: 0, fontSize: '12px', color: '#aaa' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' },
  statCard: { backgroundColor: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  statDot: { width: '10px', height: '10px', borderRadius: '50%' },
  statNum: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' },
  statLabel: { margin: 0, fontSize: '11px', color: '#aaa' }
};

export default AdminLogs;