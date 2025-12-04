"use client";

import React, { useState } from 'react';
import { ArrowRightIcon } from '../ui/icons';
import { signup } from '@/app/actions/auth';

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const userName = formData.get('userName') as string;

    if (!email || !password || !userName) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        // On successful signup, navigate to dashboard
        window.location.href = '/dashboard';
      }
    } catch (e: any) {
      console.error('Signup error:', e);
      setError(e?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="group">
        <label htmlFor="userName" className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider group-focus-within:text-brand-black transition-colors">Your Name</label>
        <input
          id="userName"
          name="userName"
          type="text"
          required
          placeholder="e.g. John Smith"
          className="w-full text-lg font-bold text-brand-black placeholder-gray-300 border-b-2 border-gray-100 focus:border-brand-yellow focus:outline-none py-2 bg-transparent transition-colors"
        />
      </div>

      <div className="group">
        <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider group-focus-within:text-brand-black transition-colors">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="chef@example.com"
          className="w-full text-lg font-bold text-brand-black placeholder-gray-300 border-b-2 border-gray-100 focus:border-brand-yellow focus:outline-none py-2 bg-transparent transition-colors"
        />
      </div>

      <div className="group">
        <label htmlFor="password" className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider group-focus-within:text-brand-black transition-colors">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full text-lg font-bold text-brand-black placeholder-gray-300 border-b-2 border-gray-100 focus:border-brand-yellow focus:outline-none py-2 bg-transparent transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-black text-white hover:bg-brand-yellow hover:text-brand-black py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
        {!isLoading && <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  );
};

export default SignupForm;
