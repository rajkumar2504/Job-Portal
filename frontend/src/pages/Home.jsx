import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Building, MapPin, Search, SlidersHorizontal } from 'lucide-react';

const formatSalary = (salary) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(salary ?? 0));

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/jobs')
      .then((res) => {
        setJobs(res.data.content || []);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
        setError('We could not load jobs right now. Please try again in a moment.');
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedLocation = locationFilter.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || '';
      const company = job.company?.toLowerCase() || '';
      const location = job.location?.toLowerCase() || '';

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        company.includes(normalizedSearch) ||
        location.includes(normalizedSearch);

      const matchesLocation = !normalizedLocation || location.includes(normalizedLocation);

      return matchesSearch && matchesLocation;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'salary-high') {
        return Number(b.salary ?? 0) - Number(a.salary ?? 0);
      }

      if (sortBy === 'salary-low') {
        return Number(a.salary ?? 0) - Number(b.salary ?? 0);
      }

      if (sortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [jobs, locationFilter, searchTerm, sortBy]);

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(to right, #4f46e5, #4338ca)', color: 'white' }}>
        <h1 style={{ color: 'white' }}>Find Your Dream Job</h1>
        <p>Browse thousands of job openings and apply with one click.</p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr 1fr', marginTop: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, company, or keyword"
              style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: 'none', width: '100%' }}
            />
          </div>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location"
            style={{ padding: '0.75rem', borderRadius: '0.75rem', border: 'none', width: '100%' }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.75rem', border: 'none', width: '100%' }}
          >
            <option value="recent">Most recent</option>
            <option value="salary-high">Highest salary</option>
            <option value="salary-low">Lowest salary</option>
            <option value="company">Company A-Z</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ marginBottom: '0.35rem' }}>Recent Jobs</h2>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {visibleJobs.length} role{visibleJobs.length === 1 ? '' : 's'} matched your filters.
          </p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontWeight: 500 }}>
          <SlidersHorizontal size={16} />
          Smart search enabled
        </div>
      </div>

      {loading && <div className="card">Loading jobs...</div>}
      {error && !loading && <div className="card" style={{ color: '#991b1b', borderColor: '#fecaca' }}>{error}</div>}

      {!loading && !error && visibleJobs.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginTop: 0 }}>No jobs matched</h3>
          <p style={{ marginBottom: 0, color: '#6b7280' }}>Try a broader keyword or clear the location filter.</p>
        </div>
      )}

      <div className="grid">
        {visibleJobs.map((job) => (
          <div key={job.id} className="card">
            <h3 style={{ marginTop: 0 }}>{job.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              <Building size={16} /> {job.company}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '1rem' }}>
              <MapPin size={16} /> {job.location}
            </div>
            <p style={{ fontWeight: 'bold' }}>{formatSalary(job.salary)} per year</p>
            <Link to={`/jobs/${job.id}`} className="btn" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
