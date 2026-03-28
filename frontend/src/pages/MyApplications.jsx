import { useEffect, useState } from 'react';
import { Briefcase, CalendarDays, CircleAlert, ExternalLink, FileText } from 'lucide-react';
import api from '../api';

const statusStyles = {
  PENDING: { background: '#fef3c7', color: '#92400e' },
  REVIEWED: { background: '#dbeafe', color: '#1d4ed8' },
  SHORTLISTED: { background: '#dcfce7', color: '#166534' },
  REJECTED: { background: '#fee2e2', color: '#991b1b' },
  ACCEPTED: { background: '#ede9fe', color: '#6d28d9' },
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data || 'Unable to load your applications right now.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return <div className="card">Loading your applications...</div>;
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: '#fecaca', color: '#991b1b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CircleAlert size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>No applications yet</h2>
        <p style={{ color: '#6b7280' }}>Apply to a job and you will be able to track its status here.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>My Applications</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Track every submission, its current status, and the resume you shared.
        </p>
      </div>

      <div className="grid">
        {applications.map((application) => {
          const statusStyle = statusStyles[application.status] || { background: '#e5e7eb', color: '#374151' };

          return (
            <div key={application.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{application.job?.title || 'Untitled job'}</h3>
                  <div style={{ display: 'grid', gap: '0.5rem', color: '#4b5563' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={16} />
                      {application.job?.company || 'Unknown company'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CalendarDays size={16} />
                      Applied {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'recently'}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    ...statusStyle,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {application.status || 'UNKNOWN'}
                </span>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <FileText size={16} />
                  Resume
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
