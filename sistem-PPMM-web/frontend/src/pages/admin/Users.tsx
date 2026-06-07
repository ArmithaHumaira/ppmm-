import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await API.put(`/users/${id}/role`, { role });
      await API.post('/logs', {
        action: 'Mengubah role user',
        target: `User #${id} → ${role}`,
        action_type: 'update'
      });
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus user ini?')) return;
    try {
      await API.delete(`/users/${id}`);
      await API.post('/logs', {
        action: 'Menghapus user',
        target: `User #${id}`,
        action_type: 'delete'
      });
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'super_admin') return '#9b59b6';
    if (role === 'admin') return '#3498db';
    return '#888';
  };

  const getRoleText = (role: string) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return 'User';
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
  const initials = user?.username?.substring(0, 2).toUpperCase() || 'SA';

  const avatarColors = ['#f48fb1', '#3498db', '#27ae60', '#9b59b6', '#f39c12', '#e74c3c'];
  const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];

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
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <span>Kelola User</span>
          </div>
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
            <h2 style={styles.headerTitle}>Kelola User</h2>
            <p style={styles.headerSub}>Tambah, edit, hapus user & admin</p>
          </div>
          <div style={styles.avatar}>{initials}</div>
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Bergabung</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyTd}>Belum ada user.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={{ ...styles.userAvatar, backgroundColor: getAvatarColor(u.id) }}>
                          {getInitials(u.username)}
                        </div>
                        <p style={styles.usernameText}>{u.username}</p>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdText}>{u.email}</p>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.roleBadge, backgroundColor: getRoleColor(u.role) + '20', color: getRoleColor(u.role) }}>
                        {getRoleText(u.role)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.tdText}>{new Date(u.created_at).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionGroup}>
                        <select
                          style={styles.select}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                        {u.id !== user?.id && (
                          <button style={styles.deleteBtn} onClick={() => handleDelete(u.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                            </svg>
                          </button>
                        )}
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
  tableCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#aaa', fontWeight: '500', borderBottom: '1px solid #f5f5f5' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle' },
  emptyTd: { padding: '2rem', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '34px', height: '34px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  usernameText: { margin: 0, fontSize: '13px', fontWeight: '500', color: '#333' },
  tdText: { margin: 0, fontSize: '13px', color: '#555' },
  roleBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  actionGroup: { display: 'flex', gap: '8px', alignItems: 'center' },
  select: { padding: '5px 8px', borderRadius: '8px', border: '1px solid #eee', fontSize: '12px', outline: 'none', cursor: 'pointer' },
  deleteBtn: { width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#fdecea', color: '#e74c3c', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default AdminUsers;