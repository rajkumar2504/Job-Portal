import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import RecruiterLogin from './pages/RecruiterLogin';
import CandidateLogin from './pages/CandidateLogin';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyApplications from './pages/MyApplications';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { BriefcaseBusiness, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    return role && email ? { role, email } : null;
  });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <nav className="nav">
        <div className="container nav-content">
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <BriefcaseBusiness size={20} />
            JobPortal
          </Link>
          <div className="nav-links">
            <Link to="/">Jobs</Link>
            {user ? (
              <>
                {user.role === 'CANDIDATE' && <Link to="/applications">My Applications</Link>}
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
                <Link to="/login" className="btn" style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}>Login Pages</Link>
                <Link to="/register" className="btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<AdminLogin setUser={setUser} />} />
          <Route path="/login/recruiter" element={<RecruiterLogin setUser={setUser} />} />
          <Route path="/login/candidate" element={<CandidateLogin setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route
            path="/applications"
            element={(
              <ProtectedRoute user={user} allowedRoles={['CANDIDATE']}>
                <MyApplications />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/recruiter"
            element={(
              <ProtectedRoute user={user} allowedRoles={['RECRUITER']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
