import { redirect } from 'next/navigation';
import { isAdminAuthed } from '../../../lib/admin-auth';
import SlidesDashboard from '../../../components/admin/SlidesDashboard';

export default function AdminSlidesPage() {
  if (!isAdminAuthed()) redirect('/admin');
  return <SlidesDashboard />;
}
