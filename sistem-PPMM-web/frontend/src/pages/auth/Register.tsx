import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

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
              <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input style={styles.input} type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            </div>

            <div style={styles.inputGroup}>
              <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input style={styles.input} type="email" name="email" placeholder="Email aktif" value={form.email} onChange={handleChange} required />
            </div>

            <div style={styles.inputGroup}>
              <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
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
  blob1: { position: 'absolute', top: '-30px', left: '-30px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  blob2: { position: 'absolute', bottom: '20px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  wrapper: { width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 4px', textAlign: 'center' },
  subtitle: { fontSize: '12px', color: '#bbb', marginBottom: '1.2rem', textAlign: 'center' },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '1.2rem' },
  stepActive: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f48fb1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  stepInactive: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#eee', color: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  stepLine: { width: '60px', height: '1px', backgroundColor: '#eee' },
  card: { backgroundColor: 'white', padding: '1.8rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%' },
  inputGroup: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '1rem', paddingBottom: '6px' },
  inputIcon: { marginRight: '8px', flexShrink: 0 },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#333', backgroundColor: 'transparent', padding: '2px 0' },
  button: { width: '100%', padding: '11px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '0.5rem' },
  error: { color: '#e74c3c', fontSize: '12px', textAlign: 'center', marginBottom: '0.8rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' },
  successMsg: { color: '#27ae60', fontSize: '12px', textAlign: 'center', marginBottom: '0.8rem', backgroundColor: '#eafaf1', padding: '8px', borderRadius: '8px' },
  link: { textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '1rem' },
  linkText: { color: '#f48fb1', textDecoration: 'none', fontWeight: '500' }
};

export default Register;