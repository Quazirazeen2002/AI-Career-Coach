'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/supabaseClient';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (data.session) {
        // If auto-login happened (e.g., email confirmation disabled)
        router.push('/');
      } else {
        // If email confirmation is required, redirect to sign in with email pre-filled
        router.push(`/sign-in?email=${encodeURIComponent(email)}&signup=success`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 sm:p-10 border border-[#E5E2D9] shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#1A1A17] mb-2">Create an account</h1>
          <p className="text-sm text-[#5A5A40] opacity-80">Start designing your evolution.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-tighter text-[#1A1A17] opacity-60">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#5A5A40] outline-none text-[#2D2D2A]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-tighter text-[#1A1A17] opacity-60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#5A5A40] outline-none text-[#2D2D2A]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-[#C45E3D] text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 flex items-center justify-center gap-2 bg-[#5A5A40] hover:opacity-90 text-white rounded-full font-medium tracking-wide transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#8C8A82]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#5A5A40] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
