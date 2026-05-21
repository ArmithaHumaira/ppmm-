import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (role === 'super_admin') navigate('/superadmin/users');
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
            <span style={styles.icon}>✉</span>
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
            <span style={styles.icon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
  blob1: { position: 'absolute', top: '-40px', left: '-40px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  blob2: { position: 'absolute', bottom: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f9c4c4', opacity: 0.5 },
  card: { backgroundColor: 'white', padding: '2.5rem 2rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 },
  title: { textAlign: 'center', fontSize: '22px', fontWeight: '600', color: '#333', margin: '0 0 6px' },
  subtitle: { textAlign: 'center', fontSize: '13px', color: '#aaa', marginBottom: '2rem' },
  inputGroup: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '1.2rem', paddingBottom: '6px' },
  icon: { fontSize: '16px', marginRight: '10px', color: '#ccc' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#333', backgroundColor: 'transparent', padding: '4px 0' },
  error: { color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#ffeaea', padding: '8px', borderRadius: '8px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#f48fb1', color: 'white', border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '1.2rem' },
  link: { textAlign: 'center', fontSize: '13px', color: '#aaa', margin: 0 },
  linkText: { color: '#f48fb1', textDecoration: 'none', fontWeight: '500' }
};

export default Login;