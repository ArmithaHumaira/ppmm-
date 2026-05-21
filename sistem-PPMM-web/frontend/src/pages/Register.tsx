import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

function Register() {
  const [form, setForm] = useState<RegisterForm>({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      setSuccess('Register berhasil! Mengarahkan ke login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setError('Register gagal! Email mungkin sudah dipakai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Buat Akun Baru</h2>
        <p style={styles.subtitle}>Daftar sebagai masyarakat untuk mulai melapor</p>
        <div style={styles.steps}>
          <div style={styles.stepActive}>1</div>
          <div style={styles.stepLine} />
          <div style={styles.stepInactive}>2</div>
          <div style={styles.stepLine} />
          <div style={styles.stepInactive}>3</div>
        </div>
        <div style={styles.card}>
          <form onSubmit={handleRegister}>
            <div style={styles.inputGroup}>
              <span style={styles.icon}>👤</span>
              <input style={styles.input} type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.icon}>✉</span>
              <input style={styles.input} type="email" name="email" placeholder="Email aktif" value={form.email} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.icon}>🔒</span>
              <input style={styles.input} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.successMsg}>{success}</p>}
            <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>
        </div>
        <p style={styles.link}>
          Sudah punya akun?{' '}
          <Link to="/login" style={styles.linkText}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#fff5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" },
  blob1: { position: 'absolute', top: '-40px', left: '-40px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  blob2: { position: 'absolute', bottom: '20px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  wrapper: { width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontSize: '22px', fontWeight: '600', color: '#333', margin: '0 0 6px', textAlign: 'center' },
  subtitle: { fontSize: '13px', color: '#aaa', marginBottom: '1.5rem', textAlign: 'center' },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '1.5rem' },
  stepActive: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' },
  stepInactive: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eee', color: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' },
  stepLine: { width: '80px', height: '1px', backgroundColor: '#eee' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', width: '100%' },
  inputGroup: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '1.2rem', paddingBottom: '6px' },
  icon: { fontSize: '16px', marginRight: '10px', color: '#ccc' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#333', backgroundColor: 'transparent', padding: '4px 0' },
  button: { width: '100%', padding: '12px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginTop: '0.5rem' },
  error: { color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' },
  successMsg: { color: '#27ae60', fontSize: '13px', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#eafaf1', padding: '8px', borderRadius: '8px' },
  link: { textAlign: 'center', fontSize: '13px', color: '#aaa', marginTop: '1rem' },
  linkText: { color: '#f48fb1', textDecoration: 'none', fontWeight: '500' }
};

export default Register;