import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // In real app:
      // const res = await api.post('/auth/login', { email, password });
      // localStorage.setItem('token', res.data.token);
      // localStorage.setItem('role', res.data.role);
      // localStorage.setItem('email', res.data.email);
      // setUser({ role: res.data.role, email: res.data.email });
      
      // Mock login:
      const role = email.includes('admin') ? 'ADMIN' : email.includes('recruiter') ? 'RECRUITER' : 'CANDIDATE';
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);
      setUser({ role, email });

      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Login</h2>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Try recruiter@test.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
