import { Link } from 'react-router-dom';
import { BriefcaseBusiness, ShieldCheck, UserRound } from 'lucide-react';

const loginOptions = [
  {
    title: 'Admin Login',
    description: 'For platform admins managing overall portal operations.',
    to: '/login/admin',
    icon: ShieldCheck,
    accent: '#b91c1c',
  },
  {
    title: 'Recruiter Login',
    description: 'For hiring teams posting jobs and reviewing applicants.',
    to: '/login/recruiter',
    icon: BriefcaseBusiness,
    accent: '#1d4ed8',
  },
  {
    title: 'Candidate Login',
    description: 'For job seekers applying and tracking applications.',
    to: '/login/candidate',
    icon: UserRound,
    accent: '#166534',
  },
];

export default function LoginSelector() {
  return (
    <div style={{ maxWidth: '920px', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Choose Your Login</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Each role has its own dedicated entry page for a cleaner experience.</p>
      </div>

      <div className="grid">
        {loginOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Link
              key={option.to}
              to={option.to}
              className="card"
              style={{ color: 'inherit', borderTop: `4px solid ${option.accent}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '999px', background: `${option.accent}18`, color: option.accent, display: 'grid', placeItems: 'center' }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ margin: 0 }}>{option.title}</h3>
              </div>
              <p style={{ marginTop: 0, color: '#6b7280' }}>{option.description}</p>
              <span style={{ fontWeight: 700, color: option.accent }}>Open login page</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
