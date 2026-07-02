'use client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };
  return <button className="pill-link pill-light" onClick={signOut}>Log out</button>;
}
