import { isAdminAuthed } from '../../lib/admin-auth';
import LoginForm from '../../components/admin/LoginForm';
import Dashboard from '../../components/admin/Dashboard';

export default function AdminPage() {
  const authed = isAdminAuthed();
  return authed ? <Dashboard /> : <LoginForm />;
}
