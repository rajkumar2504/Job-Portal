import { useEffect, useMemo, useState } from 'react';
import { Briefcase, FileText, ShieldAlert, Trash2, Users } from 'lucide-react';
import api from '../api';

const tabs = [
  { id: 'users', label: 'Users' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'applications', label: 'Applications' },
];

const formatSalary = (salary) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(salary ?? 0));

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const currentUserEmail = localStorage.getItem('email');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsRes, usersRes, jobsRes, applicationsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/jobs'),
        api.get('/admin/applications'),
      ]);

      setStats(statsRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
    } catch (err) {
      setError(err.response?.data || 'Unable to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const applicationCountByJobId = useMemo(() => {
    const counts = {};

    applications.forEach((application) => {
      const jobId = application.job?.id;
      if (!jobId) {
        return;
      }

      counts[jobId] = (counts[jobId] || 0) + 1;
    });

    return counts;
  }, [applications]);

  const handleDeleteJob = async (jobId) => {
    setDeletingJobId(jobId);
    setMessage('');
    setError('');

    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs((current) => current.filter((job) => job.id !== jobId));
      setApplications((current) => current.filter((application) => application.job?.id !== jobId));
      setStats((current) => current
        ? {
            ...current,
            totalJobs: Math.max(0, current.totalJobs - 1),
            totalApplications: Math.max(0, current.totalApplications - (applicationCountByJobId[jobId] || 0)),
          }
        : current);
      setMessage('Job deleted successfully.');
    } catch (err) {
      setError(err.response?.data || 'Unable to delete job.');
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleUserRoleChange = async (userId, role) => {
    setUpdatingUserId(userId);
    setMessage('');
    setError('');

    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      const nextUsers = users.map((user) => (user.id === userId ? res.data : user));

      setUsers(nextUsers);
      setStats((current) => current
        ? {
            ...current,
            totalAdmins: nextUsers.filter((user) => user.role === 'ADMIN').length,
            totalRecruiters: nextUsers.filter((user) => user.role === 'RECRUITER').length,
            totalCandidates: nextUsers.filter((user) => user.role === 'CANDIDATE').length,
          }
        : current);
      setMessage('User role updated successfully.');
    } catch (err) {
      setError(err.response?.data || 'Unable to update user role.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);
    setMessage('');
    setError('');

    try {
      await api.delete(`/admin/users/${userId}`);
      const deletedUser = users.find((user) => user.id === userId);
      const recruiterJobIds = jobs.filter((job) => job.recruiter?.id === userId).map((job) => job.id);

      setUsers((current) => current.filter((user) => user.id !== userId));

      if (deletedUser?.role === 'RECRUITER') {
        setJobs((current) => current.filter((job) => job.recruiter?.id !== userId));
        setApplications((current) => current.filter((application) => !recruiterJobIds.includes(application.job?.id)));
      }

      if (deletedUser?.role === 'CANDIDATE') {
        setApplications((current) => current.filter((application) => application.candidate?.id !== userId));
      }

      setStats((current) => current
        ? {
            ...current,
            totalUsers: Math.max(0, current.totalUsers - 1),
            totalAdmins: Math.max(0, current.totalAdmins - (deletedUser?.role === 'ADMIN' ? 1 : 0)),
            totalRecruiters: Math.max(0, current.totalRecruiters - (deletedUser?.role === 'RECRUITER' ? 1 : 0)),
            totalCandidates: Math.max(0, current.totalCandidates - (deletedUser?.role === 'CANDIDATE' ? 1 : 0)),
            totalJobs: Math.max(0, current.totalJobs - recruiterJobIds.length),
            totalApplications: Math.max(
              0,
              current.totalApplications
              - applications.filter((application) =>
                recruiterJobIds.includes(application.job?.id) || application.candidate?.id === userId).length,
            ),
          }
        : current);

      setMessage('User deleted successfully.');
    } catch (err) {
      setError(err.response?.data || 'Unable to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const renderUsers = () => (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>All Users</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0' }}>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 0' }}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                    disabled={updatingUserId === user.id || user.email === currentUserEmail}
                    style={{ maxWidth: '180px' }}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="RECRUITER">RECRUITER</option>
                    <option value="CANDIDATE">CANDIDATE</option>
                  </select>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                <td>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deletingUserId === user.id || user.email === currentUserEmail}
                    style={{ background: '#ef4444' }}
                  >
                    {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>All Jobs</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>{job.title}</h3>
                <div style={{ color: '#6b7280' }}>{job.company} | {job.location}</div>
                <div style={{ marginTop: '0.35rem', fontWeight: 600 }}>{formatSalary(job.salary)} per year</div>
                <div style={{ marginTop: '0.35rem', color: '#6b7280' }}>
                  Recruiter: {job.recruiter?.email || 'Unknown'}
                </div>
                <div style={{ marginTop: '0.35rem', color: '#6b7280' }}>
                  Applications: {applicationCountByJobId[job.id] || 0}
                </div>
              </div>

              <button
                className="btn"
                style={{ background: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => handleDeleteJob(job.id)}
                disabled={deletingJobId === job.id}
              >
                <Trash2 size={16} />
                {deletingJobId === job.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>All Applications</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0' }}>Candidate</th>
              <th>Job</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 0' }}>{application.candidate?.email || '-'}</td>
                <td>{application.job?.title || '-'}</td>
                <td>{application.job?.company || '-'}</td>
                <td>{application.status}</td>
                <td>{application.appliedDate ? new Date(application.appliedDate).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={28} color="var(--primary)" /> Admin Control Panel
      </h1>

      {message && (
        <div className="card" style={{ marginBottom: '1rem', borderColor: '#bbf7d0', color: '#166534' }}>
          {message}
        </div>
      )}

      {error && (
        <div className="card" style={{ marginBottom: '1rem', borderColor: '#fecaca', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">Loading admin dashboard...</div>
      ) : (
        <>
          <div className="grid" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                <Users size={32} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Total Users</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalUsers ?? 0}</span>
                <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                  Admins {stats?.totalAdmins ?? 0} | Recruiters {stats?.totalRecruiters ?? 0} | Candidates {stats?.totalCandidates ?? 0}
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#16a34a' }}>
                <Briefcase size={32} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Active Jobs</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalJobs ?? 0}</span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%', color: '#b45309' }}>
                <FileText size={32} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Applications</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalApplications ?? 0}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="btn"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--primary)',
                  border: '1px solid var(--primary)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'users' && renderUsers()}
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'applications' && renderApplications()}
        </>
      )}
    </div>
  );
}
