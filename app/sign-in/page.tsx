'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/src/supabaseClient';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialEmail = searchParams.get('email') || '';
  const isSignupSuccess = searchParams.get('signup') === 'success';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-[#1A1A17] mb-2">Welcome Back</h1>
        <p className="text-sm text-[#5A5A40] opacity-80">Continue designing your evolution.</p>
      </div>

      {isSignupSuccess && (
        <div className="mb-6 p-4 bg-[#E5E2D9]/50 rounded-xl border border-[#E5E2D9] text-sm text-[#5A5A40] font-medium text-center">
          Your account has been created. Please check your email and verify your address before logging in.
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-6">
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
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[#8C8A82]">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-[#5A5A40] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 sm:p-10 border border-[#E5E2D9] shadow-sm">
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#5A5A40]" /></div>}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
