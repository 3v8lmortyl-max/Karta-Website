import { redirect } from 'next/navigation';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import SlideForm from '../../../../components/admin/SlideForm';

export default function NewSlidePage() {
  if (!isAdminAuthed()) redirect('/admin');
  return (
    <div className="admin-shell">
      <header className="admin-header"><h1>New slide</h1></header>
      <SlideForm />
    </div>
  );
}
