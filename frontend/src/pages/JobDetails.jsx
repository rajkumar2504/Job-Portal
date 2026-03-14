import { useState, useEffect } from 'react';
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
    
    alert(`Application submitted successfully to ${job.title}!`);
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={18} /> ${job.salary.toLocaleString()}/yr</span>
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
