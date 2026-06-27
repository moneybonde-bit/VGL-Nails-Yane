'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email atau password salah.');
      setLoading(false);
      return;
    }
    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <main className="grid min-h-[100svh] place-items-center bg-nude-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-nude-100 bg-white p-8 shadow-soft-lg">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-nude-50 text-rose-gold">
          <Lock size={22} />
        </div>
        <h1 className="mt-4 text-center text-2xl text-ink">Admin VGL Nails</h1>
        <p className="mt-1 text-center text-sm text-ink-muted">Masuk untuk mengelola konten.</p>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vglnails.id"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
            />
          </label>

          {error ? <p className="text-sm text-rose-gold">{error}</p> : null}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Masuk'}
          </button>
        </div>
      </div>
    </main>
  );
}
