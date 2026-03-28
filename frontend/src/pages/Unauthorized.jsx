import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="card" style={{ maxWidth: '560px', margin: '4rem auto', textAlign: 'center' }}>
      <ShieldAlert size={42} color="#ef4444" style={{ marginBottom: '1rem' }} />
      <h2 style={{ marginTop: 0 }}>Access denied</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Your account does not have permission to view that page.
      </p>
      <Link to="/" className="btn">Return Home</Link>
    </div>
  );
}
