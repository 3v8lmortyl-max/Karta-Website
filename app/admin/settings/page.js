import { redirect } from 'next/navigation';
import { isAdminAuthed } from '../../../lib/admin-auth';
import SettingsForm from '../../../components/admin/SettingsForm';

export default function AdminSettingsPage() {
  if (!isAdminAuthed()) redirect('/admin');
  return (
    <div className="admin-shell">
      <header className="admin-header"><h1>Settings</h1></header>
      <SettingsForm />
    </div>
  );
}
