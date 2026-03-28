import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, MapPin, DollarSign, Briefcase, FileText } from 'lucide-react';
import api from '../api';

const formatSalary = (salary) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(salary ?? 0));

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error('Error fetching job details:', err));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    const role = localStorage.getItem('role');
    if (!role) {
      alert('Please login as a candidate to apply.');
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      alert('Only candidates can apply to jobs.');
      return;
    }

    try {
      await api.post('/applications', { jobId: job.id, resumeUrl });
      alert(`Application submitted successfully to ${job.title}!`);
      setApplying(false);
    } catch (err) {
      alert('Error submitting application');
      console.error(err);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0 }}>{job.title}</h1>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#4b5563', marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={18} /> {job.company}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {job.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={18} /> {formatSalary(job.salary)} per year</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} /> Full-time</span>
        </div>

        {!applying ? (
          <button className="btn" onClick={() => setApplying(true)} style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Apply Now</button>
        ) : (
          <form onSubmit={handleApply} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginTop: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>Submit Application</h3>
            <div className="form-group">
              <label><FileText size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Resume URL</label>
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
