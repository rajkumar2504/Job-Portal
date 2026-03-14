import { useState } from 'react';
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
