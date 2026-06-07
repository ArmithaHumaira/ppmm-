import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

interface Category {
  id: number;
  category_name: string;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('infrastruktur')) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  );
  if (n.includes('kebersihan')) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    </svg>
  );
  if (n.includes('bencana')) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (n.includes('ketertiban') || n.includes('keamanan')) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
  if (n.includes('kesehatan')) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
  if (n.includes('pendidikan')) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
};

function AdminKategori() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post('/categories', { category_name: newCategory });
      await API.post('/logs', {
        action: 'Menambah kategori',
        target: newCategory,
        action_type: 'create'
      });
      setSuccess('Kategori berhasil ditambah!');
      setNewCategory('');
      setShowModal(false);
      fetchCategories();
    } catch {
      setError('Gagal tambah kategori!');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm('Yakin hapus kategori ini?')) return;
    try {
      await API.delete(`/categories/${id}`);
      await API.post('/logs', {
        action: 'Menghapus kategori',
        target: name,
        action_type: 'delete'
      });
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

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
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <span>Kelola Kategori</span>
          </div>
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
            <h2 style={styles.headerTitle}>Kelola Kategori</h2>
            <p style={styles.headerSub}>Tambah atau hapus kategori laporan</p>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.addCatBtn} onClick={() => setShowModal(true)}>
              + Kategori Baru
            </button>
            <div style={styles.avatar}>{initials}</div>
          </div>
        </div>

        {success && <p style={styles.successMsg}>{success}</p>}

        {/* Category Grid */}
        <div style={styles.categoryGrid}>
          {categories.length === 0 ? (
            <p style={styles.empty}>Belum ada kategori.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} style={styles.categoryCard}>
                <div style={styles.categoryIconWrap}>
                  {getCategoryIcon(cat.category_name)}
                </div>
                <p style={styles.categoryName}>{cat.category_name}</p>
                <p style={styles.categoryCount}>0 laporan</p>
                <button style={styles.deleteBtn} onClick={() => handleDelete(cat.id, cat.category_name)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Tambah Kategori Baru</h3>
            <form onSubmit={handleAdd}>
              <input
                style={styles.modalInput}
                type="text"
                placeholder="Nama kategori..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                autoFocus
              />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.modalBtnRow}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" style={styles.submitBtn}>Tambah</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  headerTitle: { margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#333' },
  headerSub: { margin: 0, fontSize: '12px', color: '#aaa' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  addCatBtn: { padding: '8px 16px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  successMsg: { color: '#27ae60', fontSize: '13px', marginBottom: '1rem', backgroundColor: '#eafaf1', padding: '10px', borderRadius: '10px' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  categoryCard: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' },
  categoryIconWrap: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' },
  categoryName: { margin: 0, fontSize: '13px', fontWeight: '600', color: '#333', textAlign: 'center' },
  categoryCount: { margin: 0, fontSize: '11px', color: '#aaa' },
  deleteBtn: { position: 'absolute', top: '10px', right: '10px', width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#fdecea', color: '#e74c3c', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  empty: { color: '#aaa', fontSize: '13px', textAlign: 'center', gridColumn: '1 / -1' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', width: '100%', maxWidth: '360px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' },
  modalTitle: { margin: '0 0 1rem', fontSize: '16px', fontWeight: '600', color: '#333' },
  modalInput: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' },
  error: { color: '#e74c3c', fontSize: '12px', marginBottom: '1rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' },
  modalBtnRow: { display: 'flex', gap: '8px' },
  cancelBtn: { flex: 1, padding: '10px', backgroundColor: 'white', color: '#f48fb1', border: '1px solid #f48fb1', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '10px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }
};

export default AdminKategori;