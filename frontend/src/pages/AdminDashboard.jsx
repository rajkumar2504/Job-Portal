import { ShieldAlert, Users, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={28} color="var(--primary)" /> Admin Control Panel
      </h1>
      
      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <Users size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Total Users</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,204</span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#16a34a' }}>
            <Briefcase size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Active Jobs</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>342</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Platform Activity Logs</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0' }}>Action</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.75rem 0' }}>New Recruiter Sign Up</td>
              <td>hr@innovate.co</td>
              <td>Just now</td>
              <td><span style={{ background: '#fef08a', color: '#854d0e', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>Pending Approval</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.75rem 0' }}>Job Posted: Backend Dev</td>
              <td>recruiter@tech.inc</td>
              <td>2h ago</td>
              <td><span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>Active</span></td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 0' }}>Spam Job Removed</td>
              <td>System Admin</td>
              <td>5h ago</td>
              <td><span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>Deleted</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
