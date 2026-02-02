'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'inline' | 'card';
  source?: string;
}

export function NewsletterForm({ variant = 'card', source = 'landing' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || "You're on the list!");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Connection error. Try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`
        ${variant === 'card' ? 'bg-zinc-900/50 border border-zinc-800 rounded-xl p-8' : ''}
        text-center
      `}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mb-4">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">You're in!</h3>
        <p className="text-zinc-400 text-sm">
          We'll email you when Stock Watcher launches.
        </p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[140px]"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Join waitlist
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-2 sm:absolute sm:mt-0 sm:top-full sm:left-0">{message}</p>
        )}
      </form>
    );
  }

  // Card variant
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mb-4">
          <Mail className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Get early access
        </h3>
        <p className="text-zinc-400 text-sm">
          Join the waitlist. We'll notify you when Stock Watcher launches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          />
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-sm">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Join waitlist
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-zinc-500 text-xs text-center mt-4">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
