const fs = require('fs');
const path = require('path');

const BASE_DIR = "c:\\Users\\rajku\\OneDrive\\Desktop\\Job Portal\\frontend\\src";

const files = {
    "index.css": `:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg: #f3f4f6;
  --text: #1f2937;
  --card-bg: #ffffff;
  --border: #e5e7eb;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg);
  color: var(--text);
}

* {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: var(--primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: var(--primary-hover);
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.nav {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Page Layouts */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
`,
    "main.jsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
`,
    "App.jsx": `import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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
`,
    "api.js": `import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
`,
    "pages/Home.jsx": `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, MapPin, Building } from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // In a real app, we'd fetch from API
    // api.get('/jobs').then(res => setJobs(res.data.content));
    
    // Mock data for display purposes
    setJobs([
      { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', salary: 120000, description: 'React, Vue, etc.' },
      { id: 2, title: 'Backend Engineer', company: 'DataSystems', location: 'New York, NY', salary: 140000, description: 'Java Spring Boot.' },
      { id: 3, title: 'Product Manager', company: 'InnovateInc', location: 'San Francisco, CA', salary: 150000, description: 'Manage teams.' }
    ]);
  }, []);

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(to right, #4f46e5, #4338ca)', color: 'white' }}>
        <h1 style={{color:'white'}}>Find Your Dream Job</h1>
        <p>Browse thousands of job openings and apply with one click.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <input type="text" placeholder="Search jobs..." style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', width: '300px' }} />
          <button className="btn" style={{ background: 'white', color: 'var(--primary)' }}><Search size={18} /> Search</button>
        </div>
      </div>

      <h2>Recent Jobs</h2>
      <div className="grid">
        {jobs.map(job => (
          <div key={job.id} className="card">
            <h3 style={{ marginTop: 0 }}>{job.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              <Building size={16} /> {job.company}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '1rem' }}>
              <MapPin size={16} /> {job.location}
            </div>
            <p style={{ fontWeight: 'bold' }}>\${job.salary.toLocaleString()}/yr</p>
            <Link to={\`/jobs/\${job.id}\`} className="btn" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
    "pages/Login.jsx": `import { useState } from 'react';
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
`,
    "pages/Register.jsx": `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Error registering user');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>I am a...</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="CANDIDATE">Candidate (Looking for jobs)</option>
              <option value="RECRUITER">Recruiter (Hiring)</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
        </form>
      </div>
    </div>
  );
}
`,
    "pages/JobDetails.jsx": `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, MapPin, DollarSign, Briefcase, FileText } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    // Mock fetch job details
    setJob({ 
      id, 
      title: 'Frontend Developer', 
      company: 'TechCorp', 
      location: 'Remote', 
      salary: 120000, 
      description: 'We are looking for a skilled React developer to join our team. You will be responsible for building beautiful user interfaces. Requirements: 3+ years experience, React, Vite, CSS.',
      postedAt: '2 days ago'
    });
  }, [id]);

  const handleApply = (e) => {
    e.preventDefault();
    const role = localStorage.getItem('role');
    if (!role) {
      alert("Please login as a candidate to apply.");
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      alert("Only candidates can apply to jobs.");
      return;
    }
    
    alert(\`Application submitted successfully to \${job.title}!\`);
    setApplying(false);
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0 }}>{job.title}</h1>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#4b5563', marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={18} /> {job.company}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {job.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={18} /> \${job.salary.toLocaleString()}/yr</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} /> Full-time</span>
        </div>
        
        {!applying ? (
          <button className="btn" onClick={() => setApplying(true)} style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Apply Now</button>
        ) : (
          <form onSubmit={handleApply} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginTop: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>Submit Application</h3>
            <div className="form-group">
              <label><FileText size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> Resume URL</label>
              <input type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} required placeholder="https://drive.google.com/..." />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn">Submit Application</button>
              <button type="button" className="btn" style={{ background: 'transparent', color: '#4b5563', border: '1px solid #d1d5db' }} onClick={() => setApplying(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Job Description</h2>
        <p style={{ lineHeight: '1.6' }}>{job.description}</p>
      </div>
    </div>
  );
}
`,
    "pages/RecruiterDashboard.jsx": `import { useState } from 'react';
import { PlusCircle, Users } from 'lucide-react';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer', applicants: 5 }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', location: '', salary: '', description: '' });

  const handlePostJob = (e) => {
    e.preventDefault();
    setJobs([...jobs, { ...newJob, id: Date.now(), applicants: 0 }]);
    setShowForm(false);
    setNewJob({ title: '', location: '', salary: '', description: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Recruiter Dashboard</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> Post New Job
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Post a Job</h2>
          <form onSubmit={handlePostJob}>
            <div className="grid">
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Salary/yr</label>
                <input type="number" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required />
            </div>
            <button type="submit" className="btn">Publish Job</button>
          </form>
        </div>
      )}

      <h2>My Posted Jobs</h2>
      <div className="grid">
        {jobs.map(job => (
          <div key={job.id} className="card">
            <h3>{job.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              <Users size={18} /> {job.applicants} Applicants
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn" style={{flex: 1}}>View Applicants</button>
              <button className="btn" style={{flex: 1, background: '#ef4444'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
    "pages/AdminDashboard.jsx": `import { ShieldAlert, Users, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={28} color="var(--primary)" /> Admin Control Panel
      </h1>
      
      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <Users size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Total Users</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,204</span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#16a34a' }}>
            <Briefcase size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Active Jobs</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>342</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Platform Activity Logs</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0' }}>Action</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.75rem 0' }}>New Recruiter Sign Up</td>
              <td>hr@innovate.co</td>
              <td>Just now</td>
              <td><span style={{ background: '#fef08a', color: '#854d0e', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>Pending Approval</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.75rem 0' }}>Job Posted: Backend Dev</td>
              <td>recruiter@tech.inc</td>
              <td>2h ago</td>
              <td><span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>Active</span></td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 0' }}>Spam Job Removed</td>
              <td>System Admin</td>
              <td>5h ago</td>
              <td><span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>Deleted</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(BASE_DIR, relativePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content, 'utf-8');
}
console.log("Frontend files generated!");
