import { redirect } from 'next/navigation';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import ProductForm from '../../../../components/admin/ProductForm';

export default function NewProductPage() {
  if (!isAdminAuthed()) redirect('/admin');
  return (
    <div className="admin-shell">
      <header className="admin-header"><h1>New product</h1></header>
      <ProductForm />
    </div>
  );
}
