import LoginForm from '../components/LoginForm';

export default function CandidateLogin({ setUser }) {
  return <LoginForm setUser={setUser} expectedRole="CANDIDATE" />;
}
