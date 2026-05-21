import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface Category {
  id: number;
  category_name: string;
}

interface ReportForm {
  header: string;
  body: string;
  category_id: string;
}

function AddReport() {
  const [form, setForm] = useState<ReportForm>({ header: '', body: '', category_id: '' });
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>PPMM</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Kembali</button>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.title}>Tambah Laporan Baru</h3>
          <p style={styles.subtitle}>Sampaikan laporan kamu kepada kami</p>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Judul Laporan</label>
            <input style={styles.input} type="text" name="header" placeholder="Tulis judul laporan..." value={form.header} onChange={handleChange} required />

            <label style={styles.label}>Isi Laporan</label>
            <textarea style={styles.textarea} name="body" placeholder="Jelaskan laporan kamu secara detail..." value={form.body} onChange={handleChange} required />

            <label style={styles.label}>Kategori</label>
            <select style={styles.input} name="category_id" value={form.category_id} onChange={handleChange} required>
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>

            <label style={styles.label}>Upload Foto (opsional)</label>
            <input style={styles.input} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

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
  container: { minHeight: '100vh', backgroundColor: '#fff5f5', fontFamily: "'Segoe UI', sans-serif" },
  navbar: { backgroundColor: '#f48fb1', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  navTitle: { color: 'white', margin: 0, fontSize: '20px', fontWeight: '600' },
  backBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  content: { padding: '2rem', maxWidth: '600px', margin: '0 auto' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  title: { margin: '0 0 4px', color: '#333', fontSize: '18px', fontWeight: '600' },
  subtitle: { margin: '0 0 1.5rem', color: '#aaa', fontSize: '13px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', marginBottom: '1rem', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', marginBottom: '1rem', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', boxSizing: 'border-box', height: '120px', resize: 'vertical', outline: 'none' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: 'white', color: '#f48fb1', border: '1px solid #f48fb1', borderRadius: '20px', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '12px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  error: { color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' }
};

export default AddReport;