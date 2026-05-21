import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

interface Report {
  id: number;
  header: string;
  body: string;
  username: string;
  category_name: string;
  status: 'pending' | 'approved' | 'rejected';
  image: string | null;
  created_at: string;
}

interface Comment {
  id: number;
  body: string;
  username: string;
  created_at: string;
}

function DetailReport() {
  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
    fetchComments();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/comments', { body: newComment, public_report_id: id });
      setNewComment('');
      fetchComments();
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

  if (!report) return (
    <div style={{ textAlign: 'center', marginTop: '3rem', color: '#aaa', fontFamily: "'Segoe UI', sans-serif" }}>
      Loading...
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>PPMM</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Kembali</button>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.title}>{report.header}</h3>
            <span style={{ ...styles.badge, backgroundColor: getStatusColor(report.status) }}>
              {getStatusText(report.status)}
            </span>
          </div>
          <p style={styles.meta}>Oleh: {report.username} | Kategori: {report.category_name}</p>
          <p style={styles.body}>{report.body}</p>
          {report.image && (
            <img src={`http://localhost:5000/uploads/${report.image}`} alt="Foto laporan" style={styles.image} />
          )}
        </div>

        <div style={styles.commentSection}>
          <h4 style={styles.commentTitle}>Komentar ({comments.length})</h4>
          {comments.length === 0 ? (
            <p style={styles.empty}>Belum ada komentar.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} style={styles.commentCard}>
                <p style={styles.commentUser}>{comment.username}</p>
                <p style={styles.commentBody}>{comment.body}</p>
              </div>
            ))
          )}

          {user && (
            <form onSubmit={handleComment} style={styles.commentForm}>
              <textarea
                style={styles.textarea}
                placeholder="Tulis komentar kamu..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit" style={styles.submitBtn}>Kirim Komentar</button>
            </form>
          )}
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
  content: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '1.5rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  title: { margin: 0, color: '#333', fontSize: '18px', fontWeight: '600' },
  badge: { color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  meta: { fontSize: '13px', color: '#aaa', marginBottom: '1rem' },
  body: { color: '#555', lineHeight: '1.7', marginBottom: '1rem' },
  image: { width: '100%', borderRadius: '12px', marginTop: '1rem' },
  commentSection: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  commentTitle: { color: '#333', marginBottom: '1rem', fontSize: '16px', fontWeight: '600' },
  empty: { color: '#aaa', textAlign: 'center', fontSize: '14px' },
  commentCard: { padding: '12px', borderBottom: '1px solid #f5f5f5', marginBottom: '8px' },
  commentUser: { fontWeight: '600', fontSize: '13px', color: '#f48fb1', margin: '0 0 4px' },
  commentBody: { fontSize: '14px', color: '#555', margin: 0 },
  commentForm: { marginTop: '1.5rem' },
  textarea: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', boxSizing: 'border-box', height: '80px', resize: 'vertical', marginBottom: '0.5rem', outline: 'none' },
  submitBtn: { backgroundColor: '#f48fb1', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }
};

export default DetailReport;