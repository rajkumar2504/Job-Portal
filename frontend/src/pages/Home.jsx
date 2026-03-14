import { useState, useEffect } from 'react';
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
            <p style={{ fontWeight: 'bold' }}>${job.salary.toLocaleString()}/yr</p>
            <Link to={`/jobs/${job.id}`} className="btn" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
