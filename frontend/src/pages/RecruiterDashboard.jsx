import { useEffect, useState } from 'react';
import { Eye, LoaderCircle, PlusCircle, Trash2, Users } from 'lucide-react';
import api from '../api';

const applicationStatuses = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'];
const formatSalary = (salary) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(salary ?? 0));

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', location: '', salary: '', company: '', description: '' });
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [message, setMessage] = useState('');
  const [activeJobId, setActiveJobId] = useState(null);
  const [applicationsByJob, setApplicationsByJob] = useState({});
  const [loadingApplications, setLoadingApplications] = useState({});
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  useEffect(() => {
    loadRecruiterJobs();
  }, []);

  const loadRecruiterJobs = async () => {
    setLoadingJobs(true);

    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || 'Unable to load your jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async (jobId) => {
    setLoadingApplications((current) => ({ ...current, [jobId]: true }));

    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicationsByJob((current) => ({ ...current, [jobId]: Array.isArray(res.data) ? res.data : [] }));
      setActiveJobId(jobId);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || 'Unable to load applicants for this job.');
    } finally {
      setLoadingApplications((current) => ({ ...current, [jobId]: false }));
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await api.post('/jobs', newJob);
      setJobs([res.data, ...jobs]);
      setShowForm(false);
      setNewJob({ title: '', location: '', salary: '', company: '', description: '' });
      setMessage('Job posted successfully.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || 'Error posting job.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    setDeletingJobId(jobId);
    setMessage('');

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((current) => current.filter((job) => job.id !== jobId));
      setApplicationsByJob((current) => {
        const next = { ...current };
        delete next[jobId];
        return next;
      });
      if (activeJobId === jobId) {
        setActiveJobId(null);
      }
      setMessage('Job deleted successfully.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || 'Unable to delete this job.');
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleStatusChange = async (applicationId, status, jobId) => {
    setStatusLoadingId(applicationId);
    setMessage('');

    try {
      const res = await api.put(`/applications/${applicationId}/status`, { status });
      setApplicationsByJob((current) => ({
        ...current,
        [jobId]: (current[jobId] || []).map((application) => (
          application.id === applicationId ? res.data : application
        )),
      }));
      setMessage('Application status updated.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || 'Unable to update application status.');
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div>
      {message && (
        <div
          className="card"
          style={{
            marginBottom: '1rem',
            borderColor: message.includes('successfully') || message.includes('updated') ? '#bbf7d0' : '#fecaca',
            color: message.includes('successfully') || message.includes('updated') ? '#166534' : '#991b1b',
          }}
        >
          {message}
        </div>
      )}

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
                <input type="text" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Salary (INR per year)</label>
                <input type="number" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} required />
            </div>
            <button type="submit" className="btn">Publish Job</button>
          </form>
        </div>
      )}

      <h2>My Posted Jobs</h2>
      {loadingJobs && <div className="card">Loading your jobs...</div>}

      {!loadingJobs && jobs.length === 0 && (
        <div className="card" style={{ color: '#6b7280' }}>
          <p style={{ marginTop: 0 }}>You have not posted any jobs yet.</p>
          <button
            type="button"
            className="btn"
            onClick={() => setShowForm(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={18} /> Add Your First Job
          </button>
        </div>
      )}

      <div className="grid">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <h3>{job.title}</h3>
            <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>{job.company} | {job.location}</p>
            <p style={{ margin: '0 0 1rem', fontWeight: 600 }}>{formatSalary(job.salary)} per year</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              <Users size={18} /> {(applicationsByJob[job.id] || []).length} Applicants Loaded
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => loadApplications(job.id)}
                disabled={loadingApplications[job.id]}
              >
                {loadingApplications[job.id] ? <LoaderCircle size={16} /> : <Eye size={16} />}
                {activeJobId === job.id ? 'Refresh Applicants' : 'View Applicants'}
              </button>
              <button
                className="btn"
                style={{ flex: 1, background: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => handleDeleteJob(job.id)}
                disabled={deletingJobId === job.id}
              >
                <Trash2 size={16} />
                {deletingJobId === job.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>

            {activeJobId === job.id && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ marginTop: 0 }}>Applicants</h4>
                {(applicationsByJob[job.id] || []).length === 0 ? (
                  <p style={{ marginBottom: 0, color: '#6b7280' }}>No applications have been submitted yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {(applicationsByJob[job.id] || []).map((application) => (
                      <div key={application.id} style={{ border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{application.candidate?.name || application.candidate?.email || 'Candidate'}</div>
                            <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>{application.candidate?.email}</div>
                          </div>
                          <a href={application.resumeUrl} target="_blank" rel="noreferrer">View Resume</a>
                        </div>

                        <div style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <label htmlFor={`status-${application.id}`} style={{ fontWeight: 500 }}>Status</label>
                          <select
                            id={`status-${application.id}`}
                            value={application.status}
                            onChange={(e) => handleStatusChange(application.id, e.target.value, job.id)}
                            disabled={statusLoadingId === application.id}
                            style={{ maxWidth: '220px' }}
                          >
                            {applicationStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          {statusLoadingId === application.id && <span style={{ color: '#6b7280' }}>Updating...</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
