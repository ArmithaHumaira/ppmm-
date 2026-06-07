import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

interface Category {
  id: number;
  category_name: string;
}

interface ReportForm {
  header: string;
  body: string;
  location: string;
  category_id: string;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('infrastruktur')) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  );
  if (n.includes('kebersihan')) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
    </svg>
  );
  if (n.includes('keamanan')) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
  if (n.includes('fasilitas')) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
  if (n.includes('pelayanan')) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
};

function AddReport() {
  const [form, setForm] = useState<ReportForm>({ header: '', body: '', location: '', category_id: '' });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) { setError('Pilih kategori dulu!'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('header', form.header);
      formData.append('body', form.body);
      formData.append('category_id', form.category_id);
      if (image) formData.append('image', image);
      await API.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch {
      setError('Gagal tambah laporan! Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.username?.substring(0, 2).toUpperCase() || 'U';

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
          <Link to="/dashboard" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Beranda</span>
          </Link>
          <div style={styles.navItemActive}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Buat Laporan</span>
          </div>
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
          <Link to="/profile" style={styles.navItemLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profil</span>
          </Link>
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

      {/* Main Content */}
      <div style={styles.main}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Kembali ke Beranda
        </button>

        <div style={styles.card}>
          <h3 style={styles.title}>Buat Laporan Baru</h3>
          <p style={styles.subtitle}>Ceritakan masalah di sekitarmu, kami akan teruskan ke pihak berwenang</p>

          <form onSubmit={handleSubmit}>
            {/* Kategori Grid */}
            <label style={styles.label}>Kategori Laporan</label>
            <div style={styles.categoryGrid}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    ...styles.categoryCard,
                    border: form.category_id === String(cat.id)
                      ? '1.5px solid #f48fb1'
                      : '1.5px solid #eee',
                    backgroundColor: form.category_id === String(cat.id)
                      ? '#fff0f5'
                      : 'white'
                  }}
                  onClick={() => setForm({ ...form, category_id: String(cat.id) })}
                >
                  {getCategoryIcon(cat.category_name)}
                  <span style={{ ...styles.categoryName, color: form.category_id === String(cat.id) ? '#f48fb1' : '#888' }}>
                    {cat.category_name}
                  </span>
                </div>
              ))}
            </div>

            {/* Judul */}
            <div style={styles.inputGroup}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <input
                style={styles.inputFlat}
                type="text"
                name="header"
                placeholder="Judul laporan"
                value={form.header}
                onChange={handleChange}
                required
              />
            </div>

            {/* Deskripsi */}
            <label style={styles.label}>Deskripsi Masalah</label>
            <textarea
              style={styles.textarea}
              name="body"
              placeholder="Jelaskan secara detail masalah yang terjadi..."
              value={form.body}
              onChange={handleChange}
              required
            />

            {/* Lokasi */}
            <div style={styles.inputGroup}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                style={styles.inputFlat}
                type="text"
                name="location"
                placeholder="Lokasi kejadian"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            {/* Upload Foto */}
            <label style={styles.label}>Foto Bukti</label>
            <label style={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f48fb1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={styles.uploadText}>Klik untuk upload foto</p>
                </div>
              )}
            </label>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.btnRow}>
              <button type="button" style={styles.cancelBtn} onClick={() => navigate('/dashboard')}>Batal</button>
              <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </form>
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
  backBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0 },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  title: { margin: '0 0 4px', color: '#333', fontSize: '18px', fontWeight: '600' },
  subtitle: { margin: '0 0 1.5rem', color: '#aaa', fontSize: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '8px', marginTop: '1rem' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1rem' },
  categoryCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 8px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', gap: '6px' },
  categoryName: { fontSize: '11px', textAlign: 'center' },
  inputGroup: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '1rem', paddingBottom: '8px', gap: '8px' },
  inputFlat: { flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#333', backgroundColor: 'transparent', padding: '4px 0' },
  textarea: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #eee', fontSize: '13px', boxSizing: 'border-box', height: '100px', resize: 'vertical', outline: 'none', backgroundColor: '#fffafa', marginBottom: '1rem' },
  uploadArea: { display: 'block', border: '1.5px dashed #f48fb1', borderRadius: '10px', padding: '1rem', cursor: 'pointer', marginBottom: '1rem', textAlign: 'center' },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  uploadText: { margin: 0, fontSize: '12px', color: '#aaa' },
  error: { color: '#e74c3c', fontSize: '12px', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { flex: 1, padding: '11px', backgroundColor: 'white', color: '#f48fb1', border: '1.5px solid #f48fb1', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '11px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }
};

export default AddReport;