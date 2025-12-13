'use client';

// --- Imports ---
import React, { useState, useEffect } from 'react';
import PollInfoForm from '../../components/create-poll/PollInfoForm';
import PollItemsForm from '../../components/create-poll/PollItemsForm';
import SubmitButton from '../../components/create-poll/SubmitButton';
import ErrorPopup from '../../components/ui/ErrorPopup';
import { ArrowRightIcon } from '../../components/ui/icons';
import { createClient } from '../../lib/supabase';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';

// --- Page Component ---
export default function CreatePollPage() {
  // --- State ---
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState('24h');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [errorPopup, setErrorPopup] = useState({ isOpen: false, message: '' });

  // State includes 'file' to hold the raw File object for the API
  const [contenderA, setContenderA] = useState({
    id: 'A',
    name: '',
    description: '',
    price: '',
    image: null as string | null,
    file: null as File | null
  });

  const [contenderB, setContenderB] = useState({
    id: 'B',
    name: '',
    description: '',
    price: '',
    image: null as string | null,
    file: null as File | null
  });

  // --- Effects ---
  // Fetch user data for navbar
  useEffect(() => {
    const CACHE_KEY = 'dashboard_data';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const fetchUserData = async () => {
      try {
        // Check cache first
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Use cache if less than 5 minutes old
            if (age < CACHE_DURATION) {
              console.log('Using cached user data');
              setUserData(cachedData.owner);
              return;
            }
          } catch (e) {
            console.warn('Cache parse error, fetching fresh data');
          }
        }

        // Fetch fresh data if no cache or expired
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const res = await fetch('/api/dashboard', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            },
            credentials: 'include' // Include cookies for auth
          });

          if (res.ok) {
            const data = await res.json();
            setUserData(data.owner);

            // Update cache
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
              data: data,
              timestamp: Date.now()
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // --- Event Handlers ---
  const handleSubmit = async () => {
    if (!title || !contenderA.name || !contenderB.name) {
      setErrorPopup({ isOpen: true, message: "Please fill in the battle title and contender names." });
      return;
    }

    if (!contenderA.file || !contenderB.file) {
      setErrorPopup({ isOpen: true, message: "Both contenders need an image to start the battle!" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build form data for API
      const formData = new FormData();
      formData.append('title', title);
      formData.append('question', question || 'Which one are you ordering?');
      formData.append('duration', duration);
      formData.append('itemA_name', contenderA.name);
      formData.append('itemA_desc', contenderA.description);
      formData.append('itemA_price', contenderA.price);
      formData.append('itemA_image', contenderA.file!);
      formData.append('itemB_name', contenderB.name);
      formData.append('itemB_desc', contenderB.description);
      formData.append('itemB_price', contenderB.price);
      formData.append('itemB_image', contenderB.file!);

      // Get session for Authorization header
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Use Next.js API route with cookie-based authentication AND Bearer token fallback
      const response = await fetch('/api/polls/create', {
        method: 'POST',
        headers,
        credentials: 'include', // Ensure cookies are sent
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        if (response.status === 401) {
          setErrorPopup({ isOpen: true, message: 'Please log in to create a battle.' });
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        // Show detailed error information
        const errorMessage = errorData.error || 'Failed to create battle';
        const errorDetails = errorData.details ? `\n\nDetails: ${errorData.details}` : '';
        const errorHint = errorData.hint ? `\n\nHint: ${errorData.hint}` : '';
        const errorCode = errorData.code ? `\n\nError Code: ${errorData.code}` : '';
        throw new Error(`${errorMessage}${errorDetails}${errorHint}${errorCode}`);
      }

      const { pollId: poll } = await response.json();

      // Trigger dashboard refresh on next load
      sessionStorage.setItem('dashboard_refresh', 'true');

      // Navigate to the new poll
      window.location.href = `/poll/${poll}`;

    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorPopup({ isOpen: true, message: `Error: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Dashboard Navbar */}
      <DashboardNavbar
        restaurantName={userData?.restaurantName}
        ownerName={userData?.name}
      />

      <div className="pt-28 pb-24 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#111111 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Navigation Breadcrumb */}
          <div className="mb-8">
            <a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-black transition-colors">
              <span className="rotate-180"><ArrowRightIcon className="w-4 h-4" /></span>
              Back to Dashboard
            </a>
          </div>

          <div className="mb-12 text-center md:text-left relative">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
              <span className="font-bold text-brand-black text-[10px] tracking-widest uppercase">New Campaign</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-black tracking-tight mb-4 leading-tight">
              Design your <br className="hidden md:block" />
              <span className="relative inline-block">
                Battle
                <svg className="absolute bottom-2 left-0 w-full h-3 text-brand-yellow -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 5" fill="currentColor" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
              Upload two photos, set the stage, and let the community decide what makes it to your menu.
            </p>
          </div>

          <div className="space-y-8 pb-12">
            <PollInfoForm title={title} setTitle={setTitle} question={question} setQuestion={setQuestion} />
            <PollItemsForm
              contenderA={contenderA}
              contenderB={contenderB}
              setContenderA={setContenderA}
              setContenderB={setContenderB}
            />
            <SubmitButton
              duration={duration}
              setDuration={setDuration}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

        </div>
      </div>

      {/* Error Popup */}
      <ErrorPopup
        isOpen={errorPopup.isOpen}
        onClose={() => setErrorPopup({ isOpen: false, message: '' })}
        message={errorPopup.message}
        type="error"
      />
    </div>
  );
}
