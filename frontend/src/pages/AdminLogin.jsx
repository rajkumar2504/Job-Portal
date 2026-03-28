import LoginForm from '../components/LoginForm';

export default function AdminLogin({ setUser }) {
  return <LoginForm setUser={setUser} expectedRole="ADMIN" />;
}
