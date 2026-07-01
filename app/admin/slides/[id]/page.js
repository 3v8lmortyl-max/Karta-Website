import { redirect, notFound } from 'next/navigation';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';
import SlideForm from '../../../../components/admin/SlideForm';

export default async function EditSlidePage({ params }) {
  if (!isAdminAuthed()) redirect('/admin');
  const sb = supabaseAdmin();
  const { data: slide } = await sb.from('slides').select('*').eq('id', params.id).single();
  if (!slide) notFound();
  return (
    <div className="admin-shell">
      <header className="admin-header"><h1>Edit slide</h1></header>
      <SlideForm initial={slide} />
    </div>
  );
}
