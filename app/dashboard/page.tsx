"use client";

import React, { useState, useEffect } from 'react';
import { PlusIcon } from '../../components/ui/icons';
import BattleHistory from '../../components/dashboard/BattleHistory';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import OverviewTab from '../../components/dashboard/tabs/OverviewTab';
import AnalyticsTab from '../../components/dashboard/tabs/AnalyticsTab';
import SettingsTab from '../../components/dashboard/tabs/SettingsTab';

import { createClient } from '@/lib/supabase';
import { DashboardResponse } from '../../types/api';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const CACHE_KEY = 'dashboard_data';
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

        const fetchData = async (skipCache = false) => {
            try {
                // Check cache first (unless explicitly skipped)
                if (!skipCache) {
                    const cached = sessionStorage.getItem(CACHE_KEY);
                    if (cached) {
                        try {
                            const { data: cachedData, timestamp } = JSON.parse(cached);
                            const age = Date.now() - timestamp;

                            // Use cache if less than 5 minutes old
                            if (age < CACHE_DURATION) {
                                console.log('Using cached dashboard data');
                                setData(cachedData);
                                setLoading(false);
                                return;
                            }
                        } catch (e) {
                            console.warn('Cache parse error, fetching fresh data');
                        }
                    }
                }

                // Get the Supabase client and session
                const supabase = createClient();
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    console.error('No active session');
                    window.location.href = '/login';
                    return;
                }

                // Fetch from Next.js API route with Bearer token
                const res = await fetch('/api/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    credentials: 'include' // Include cookies for auth
                });

                if (res.ok) {
                    const json = await res.json();
                    // Validate response structure
                    if (json && typeof json === 'object') {
                        setData(json);
                        setError(null);

                        // Cache the data
                        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                            data: json,
                            timestamp: Date.now()
                        }));
                    } else {
                        setError('Invalid data received from server');
                    }
                } else if (res.status === 401) {
                    // Redirect to login if unauthorized
                    window.location.href = '/login';
                } else if (res.status === 429) {
                    setError('Too many requests. Please wait a moment and try again.');
                } else {
                    setError('Failed to load dashboard. Please try again later.');
                }
            } catch (e) {
                console.error("Dashboard fetch error", e);
                setError('Network error. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        // Check if we should force refresh (e.g., after creating a poll)
        const forceRefresh = sessionStorage.getItem('dashboard_refresh');
        if (forceRefresh) {
            sessionStorage.removeItem('dashboard_refresh');
            fetchData(true); // Skip cache
        } else {
            fetchData();
        }

        // Handle hash navigation for Profile link
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'settings') {
                setActiveTab('settings');
            }
        };

        // Check hash on mount
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex h-64 items-center justify-center">
                    <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Dashboard</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-black text-white px-6 py-2 rounded-full font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return <OverviewTab data={data} />;
            case 'history':
                return (
                    <div className="animate-in slide-in-from-right-10 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-brand-black">Full Battle History</h2>
                            <div className="flex gap-2">
                                <select className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bold text-gray-500 focus:outline-none focus:border-brand-yellow">
                                    <option>Last 30 Days</option>
                                    <option>All Time</option>
                                </select>
                            </div>
                        </div>
                        <BattleHistory polls={data?.historyPolls || []} fullPage />
                    </div>
                );
            case 'analytics':
                return <AnalyticsTab setActiveTab={setActiveTab} />;
            case 'settings':
                return <SettingsTab data={data} />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans flex flex-col">
            {/* Dashboard Navbar */}
            <DashboardNavbar
                restaurantName={data?.owner?.restaurantName}
                ownerName={data?.owner?.name}
            />

            <div className="flex flex-1 pt-20">
                {/* Sidebar - Hidden on mobile, fixed on desktop */}
                <div className="w-20 lg:w-72 flex-shrink-0 z-40 h-[calc(100vh-5rem)] hidden md:block sticky top-20">
                    <Sidebar
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Main Content Area - Scrollable */}
                <div className="flex-1 relative overflow-y-auto scroll-smooth">

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 min-h-full">

                        {/* Mobile Header */}
                        <div className="md:hidden mb-8 flex items-center justify-between">
                            <div className="font-extrabold text-2xl text-brand-black">MenuFight.</div>
                            <button className="text-sm font-bold bg-brand-lightGray px-4 py-2 rounded-full">Menu</button>
                        </div>

                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black mt-1">
                                    {activeTab === 'overview' ? (
                                        <>
                                            Welcome, <span className="relative inline-block">
                                                {data?.owner?.name || 'Chef'}
                                                <svg className="absolute bottom-1 left-0 w-full h-3 text-brand-yellow -z-10 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                                    <path d="M0 5 Q 50 15 100 5" fill="currentColor" />
                                                </svg>
                                            </span>
                                        </>
                                    ) : (
                                        activeTab === 'history' ? 'Battle History' : activeTab === 'settings' ? 'Settings' : 'Analytics'
                                    )}
                                </h1>
                                {activeTab === 'overview' && (
                                    <p className="text-gray-500 mt-2 font-medium">Here's what's happening with your menu today.</p>
                                )}
                            </div>

                            {activeTab === 'overview' && (
                                <a href="/create-poll" className="group bg-brand-black text-white pl-6 pr-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-brand-yellow hover:text-brand-black transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-brand-black/10 flex items-center justify-center">
                                        <PlusIcon className="w-5 h-5" />
                                    </div>
                                    Create Battle
                                </a>
                            )}
                        </div>

                        {renderContent()}

                    </div>
                </div>
            </div>
        </div>
    );
}
