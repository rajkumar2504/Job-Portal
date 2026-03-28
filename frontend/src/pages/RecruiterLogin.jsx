import LoginForm from '../components/LoginForm';

export default function RecruiterLogin({ setUser }) {
  return <LoginForm setUser={setUser} expectedRole="RECRUITER" />;
}
