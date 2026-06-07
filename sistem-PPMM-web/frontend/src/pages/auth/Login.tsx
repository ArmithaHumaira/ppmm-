import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === 'super_admin') navigate('/admin/dashboard');
      else if (role === 'admin') navigate('/admin/laporan');
      else navigate('/dashboard');
    } catch {
      setError('Email atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.card}>
        <h2 style={styles.title}>Selamat Datang Kembali</h2>
        <p style={styles.subtitle}>Masuk untuk melanjutkan laporan kamu</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input
              style={styles.input}
              type="email"
              placeholder="Email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.row}>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ marginRight: '6px' }}
              />
              Ingat saya
            </label>
            <span style={styles.forgotText}>Lupa password?</span>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={styles.link}>
          Belum punya akun?{' '}
          <Link to="/register" style={styles.linkText}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#fff5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" },
  blob1: { position: 'absolute', top: '-30px', left: '-30px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  blob2: { position: 'absolute', bottom: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  card: { backgroundColor: 'white', padding: '2rem 1.8rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1 },
  title: { textAlign: 'center', fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 4px' },
  subtitle: { textAlign: 'center', fontSize: '12px', color: '#bbb', marginBottom: '1.5rem' },
  inputGroup: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '1rem', paddingBottom: '6px' },
  inputIcon: { marginRight: '8px', flexShrink: 0 },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#333', backgroundColor: 'transparent', padding: '2px 0' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' },
  rememberLabel: { display: 'flex', alignItems: 'center', fontSize: '12px', color: '#888', cursor: 'pointer' },
  forgotText: { fontSize: '12px', color: '#f48fb1', cursor: 'pointer' },
  error: { color: '#e74c3c', fontSize: '12px', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' },
  button: { width: '100%', padding: '11px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '1rem' },
  link: { textAlign: 'center', fontSize: '12px', color: '#bbb', margin: 0 },
  linkText: { color: '#f48fb1', textDecoration: 'none', fontWeight: '500' }
};

export default Login;