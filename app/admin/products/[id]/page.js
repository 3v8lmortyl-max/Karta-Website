import { redirect, notFound } from 'next/navigation';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';
import ProductForm from '../../../../components/admin/ProductForm';

export default async function EditProductPage({ params }) {
  if (!isAdminAuthed()) redirect('/admin');
  const sb = supabaseAdmin();
  const { data: product } = await sb.from('products').select('*').eq('id', params.id).single();
  if (!product) notFound();
  return (
    <div className="admin-shell">
      <header className="admin-header"><h1>Edit product</h1></header>
      <ProductForm initial={product} />
    </div>
  );
}
