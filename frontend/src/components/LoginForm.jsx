import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';

const roleDetails = {
  ADMIN: {
    title: 'Admin Login',
    subtitle: 'Sign in to manage platform activity, recruiters, and oversight tools.',
    accent: '#b91c1c',
    placeholder: 'Try admin@test.com',
  },
  RECRUITER: {
    title: 'Recruiter Login',
    subtitle: 'Access your jobs, applicants, and hiring workflow from one place.',
    accent: '#1d4ed8',
    placeholder: 'Try recruiter@test.com',
  },
  CANDIDATE: {
    title: 'Candidate Login',
    subtitle: 'Sign in to explore jobs, apply faster, and track your applications.',
    accent: '#166534',
    placeholder: 'Try candidate@test.com',
  },
};

export default function LoginForm({ setUser, expectedRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const details = roleDetails[expectedRole] || {
    title: 'Login',
    subtitle: 'Sign in to continue.',
    accent: 'var(--primary)',
    placeholder: 'Enter your email',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });

      if (expectedRole && res.data.role !== expectedRole) {
        setError(`This page is only for ${expectedRole.toLowerCase()} accounts. You signed in as ${res.data.role.toLowerCase()}.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', res.data.email);
      setUser({ role: res.data.role, email: res.data.email });

      const defaultRoute = res.data.role === 'RECRUITER'
        ? '/recruiter'
        : res.data.role === 'ADMIN'
          ? '/admin'
          : '/applications';

      navigate(location.state?.from?.pathname || defaultRoute);
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '4rem auto' }}>
      <div className="card" style={{ borderTop: `4px solid ${details.accent}` }}>
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>{details.title}</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 0, marginBottom: '1.5rem' }}>{details.subtitle}</p>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={details.placeholder} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : details.title}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', color: '#6b7280' }}>
          <Link to="/login" style={{ fontWeight: 600 }}>All Login Options</Link>
          <Link to="/register" style={{ fontWeight: 600 }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
}
