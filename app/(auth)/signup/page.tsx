
import React from 'react';
import SignupForm from '../../../components/forms/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen pt-32 px-4 flex justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl">
         <h1 className="text-3xl font-extrabold text-brand-black mb-8 text-center">Join the Fight</h1>
         <SignupForm />
         <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account? <a href="/login" className="text-brand-black font-bold border-b border-brand-yellow">Log In</a>
         </p>
      </div>
    </div>
  );
}
