import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card" style={{ maxWidth: '560px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 style={{ marginTop: 0 }}>Page not found</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        The page you requested does not exist or may have moved.
      </p>
      <Link to="/" className="btn">Go to Jobs</Link>
    </div>
  );
}
