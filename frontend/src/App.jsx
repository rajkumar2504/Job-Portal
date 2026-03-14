import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (role && email) {
      setUser({ role, email });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <nav className="nav">
        <div className="container nav-content">
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>JobPortal</Link>
          <div className="nav-links">
            <Link to="/">Jobs</Link>
            {user ? (
              <>
                {user.role === 'RECRUITER' && <Link to="/recruiter">Recruiter Dashboard</Link>}
                {user.role === 'ADMIN' && <Link to="/admin">Admin Dashboard</Link>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                  <UserIcon size={18} /> <span>{user.email}</span>
                  <button onClick={logout} className="btn" style={{ background: '#ef4444', marginLeft: '1rem' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn" style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}>Login</Link>
                <Link to="/register" className="btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
