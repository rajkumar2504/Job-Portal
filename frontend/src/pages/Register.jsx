import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/auth/register', formData);
      setMessage('Registration successful. You can log in now.');
      const loginRoute = formData.role === 'RECRUITER' ? '/login/recruiter' : '/login/candidate';
      navigate(loginRoute);
    } catch (err) {
      setMessage(err.response?.data || 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Create an Account</h2>
        {message && (
          <div style={{ background: message.includes('successful') ? '#dcfce7' : '#fee2e2', color: message.includes('successful') ? '#166534' : '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {message}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
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
          <div className="form-group">
            <label>I am a...</label>
            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="CANDIDATE">Candidate (Looking for jobs)</option>
              <option value="RECRUITER">Recruiter (Hiring)</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
