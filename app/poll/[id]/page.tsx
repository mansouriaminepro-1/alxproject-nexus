"use client";
import React, { useState, useEffect } from 'react';
import { TrophyIcon, FireIcon, ShareIcon, CheckIcon, ArrowRightIcon, MapPinIcon, GlobeIcon, XIcon } from '../../../components/ui/icons';
import { PollData } from '../../../types/poll';
import { createClient } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';
import DashboardNavbar from '../../../components/dashboard/DashboardNavbar';

export default function VotePage() {
    const [poll, setPoll] = useState<PollData | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // New State
    const [pendingVoteId, setPendingVoteId] = useState<string | null>(null); // New State
    const [pollId, setPollId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    // Share functionality
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    setIsAuthenticated(true);

                    // Fetch user data for navbar
                    const cached = sessionStorage.getItem('dashboard_data');
                    if (cached) {
                        try {
                            const { data: cachedData } = JSON.parse(cached);
                            setUserData(cachedData.owner);
                        } catch (e) {
                            // Fetch fresh if cache fails
                            const res = await fetch('/api/dashboard', {
                                headers: { 'Authorization': `Bearer ${session.access_token}` },
                                credentials: 'include'
                            });
                            if (res.ok) {
                                const data = await res.json();
                                setUserData(data.owner);
                            }
                        }
                    } else {
                        // Fetch user data
                        const res = await fetch('/api/dashboard', {
                            headers: { 'Authorization': `Bearer ${session.access_token}` },
                            credentials: 'include'
                        });
                        if (res.ok) {
                            const data = await res.json();
                            setUserData(data.owner);
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        // Extract ID from URL (e.g., /poll/UUID)
        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[2];
        setPollId(id);

        const fetchPoll = async () => {
            try {
                const res = await fetch(`/api/polls/${id}`);
                if (!res.ok) throw new Error('Failed to load poll');
                const data = await res.json();
                setPoll(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPoll();

            // Check local storage for previous vote
            const storedVote = localStorage.getItem(`menufight_voted_${id}`);
            if (storedVote) {
                setSelectedId(storedVote);
                setHasVoted(true);
            }
        }
    }, []);

    // Initiates the voting process (opens confirmation)
    const handleVoteClick = (itemId: string) => {
        if (hasVoted) return;
        setPendingVoteId(itemId);
        setShowConfirmModal(true);
    };

    // Confirms and submits the vote
    const confirmVote = async () => {
        if (hasVoted || !pollId || !pendingVoteId) return;

        const itemId = pendingVoteId;
        // Close confirm modal
        setShowConfirmModal(false);

        try {
            const res = await fetch(`/api/polls/${pollId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId })
            });

            if (res.ok) {
                // Success - update UI
                const data = await res.json();
                setSelectedId(itemId);
                setHasVoted(true);
                setShowThankYouModal(true);
                localStorage.setItem(`menufight_voted_${pollId}`, itemId);
            } else {
                // Handle error (rate limit, etc)
                const errorData = await res.json();
                alert(errorData.error || 'Failed to submit vote. Please try again.');
            }
        } catch (e) {
            console.error('Vote failed:', e);
            alert('A network error occurred. Please check your connection.');
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold">Loading Battle Arena...</p>
        </div>
    );

    if (!poll) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-bold text-xl">Battle not found.</p>
        </div>
    );

    return (
        <>
            {/* Conditional Navbar */}
            {isAuthenticated ? (
                <DashboardNavbar
                    restaurantName={userData?.restaurantName}
                    ownerName={userData?.name}
                />
            ) : (
                <Navbar />
            )}

            <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 font-sans relative overflow-x-hidden selection:bg-brand-yellow selection:text-brand-black">

                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(#111111 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px'
                    }}>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header Section */}
                    <div className="text-center mb-12 relative">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-red-100 bg-red-50 text-brand-red shadow-sm animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                            <span className="font-bold text-[10px] tracking-widest uppercase">Voting Ends in {poll.endsIn}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-black mb-4 tracking-tight">
                            {poll.title}
                        </h1>
                        <p className="text-lg text-gray-500 font-medium">
                            {poll.question}
                        </p>
                    </div>

                    {/* BATTLE ARENA */}
                    <div className="relative mb-24">

                        {/* The VS Badge (Center Desktop / Top Mobile) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-brand-yellow rounded-full border-[6px] border-white shadow-plate flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                                <span className="font-serif italic font-black text-4xl text-brand-black pr-1 pt-1">VS</span>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 relative">

                            {poll.items.map((item) => {
                                const isSelected = selectedId === item.id;
                                const isOtherSelected = hasVoted && !isSelected;
                                const isHovered = hoveredId === item.id;
                                const isDimmed = (hoveredId && hoveredId !== item.id) || isOtherSelected;

                                return (
                                    <div
                                        key={item.id}
                                        onMouseEnter={() => !hasVoted && setHoveredId(item.id)}
                                        onMouseLeave={() => !hasVoted && setHoveredId(null)}
                                        className={`
                                relative group rounded-[2.5rem] bg-white shadow-card overflow-hidden transition-all duration-500 border-2
                                ${isSelected ? 'ring-4 ring-brand-yellow border-transparent scale-[1.02] shadow-2xl z-20' : 'border-transparent'}
                                ${isDimmed ? 'opacity-50 blur-[1px] scale-95 grayscale-[30%]' : 'opacity-100'}
                                ${!hasVoted ? 'hover:shadow-plate cursor-pointer' : ''}
                           `}
                                        onClick={() => !hasVoted && handleVoteClick(item.id)}
                                    >
                                        {/* Image Section */}
                                        <div className="relative h-64 md:h-96 w-full overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                                            {/* Price Badge */}
                                            {item.price && (
                                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-brand-black shadow-lg">
                                                    {item.price}
                                                </div>
                                            )}

                                            {/* Selection Overlay */}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-brand-black/40 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                                                    <div className="bg-brand-yellow text-brand-black w-20 h-20 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                                                        <CheckIcon className="w-10 h-10" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-8 md:p-10 relative">
                                            <h3 className="text-2xl md:text-4xl font-extrabold text-brand-black mb-3 leading-tight">{item.name}</h3>
                                            <p className="text-gray-500 font-medium leading-relaxed mb-8 text-base md:text-lg">
                                                {item.description}
                                            </p>

                                            {/* Action Button */}
                                            <button
                                                className={`
                                        w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2
                                        ${isSelected
                                                        ? 'bg-brand-green text-white shadow-lg pointer-events-none'
                                                        : 'bg-brand-black text-white hover:bg-brand-yellow hover:text-brand-black shadow-md hover:shadow-xl'
                                                    }
                                    `}
                                                disabled={hasVoted}
                                            >
                                                {isSelected ? (
                                                    <>Voted <CheckIcon className="w-5 h-5" /></>
                                                ) : hasVoted ? (
                                                    "Option Not Selected"
                                                ) : (
                                                    <>Taste This One <FireIcon className="w-5 h-5" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* POST VOTE ACTIONS */}
                    <div className={`transition-all duration-700 transform ${hasVoted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
                        <div className="max-w-xl mx-auto text-center">
                            <h3 className="text-2xl font-bold text-brand-black mb-6">Thanks for voting!</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href={`/poll/${poll.id}/results`} className="flex-1 bg-white border-2 border-brand-black text-brand-black px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-black hover:text-brand-yellow transition-all shadow-soft flex items-center justify-center gap-2">
                                    View Live Results <ArrowRightIcon className="w-5 h-5" />
                                </a>
                                <button onClick={handleShare} className="flex-1 bg-brand-yellow text-brand-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-105 transition-all shadow-soft flex items-center justify-center gap-2">
                                    {copied ? 'Link Copied!' : 'Share Poll'} <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-400 font-medium">Votes are anonymous. Results update in real-time.</p>
                        </div>
                    </div>

                    {/* SHARE SECTION (Visible when not voted) */}
                    {!hasVoted && (
                        <div className="max-w-xl mx-auto text-center mb-24 mt-12 animate-in fade-in duration-700 delay-300">
                            <h3 className="font-bold text-brand-black mb-6 text-xl">Get your friends involved</h3>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={handleShare}
                                    className="bg-brand-black text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                                >
                                    {copied ? (
                                        <>
                                            <CheckIcon className="w-5 h-5 text-green-400" /> Link Copied!
                                        </>
                                    ) : (
                                        <>
                                            <ShareIcon className="w-5 h-5" /> Share Battle
                                        </>
                                    )}
                                </button>
                                <a href="/" className="bg-white border-2 border-gray-200 text-brand-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:border-brand-black transition-colors">
                                    <ArrowRightIcon className="w-4 h-4 rotate-180" /> Back to Home
                                </a>
                            </div>
                        </div>
                    )}

                    {/* RESTAURANT INFO CARD */}
                    <div className="mt-32 max-w-4xl mx-auto">
                        <div className="bg-[#111111] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-yellow/20 transition-colors duration-500"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">

                                {/* Avatar */}
                                <div className="shrink-0">
                                    <div className="w-32 h-32 rounded-full border-4 border-brand-yellow/20 p-1">
                                        <img
                                            src={poll.restaurant.avatar}
                                            alt={poll.restaurant.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="text-center md:text-left flex-1">
                                    <div className="inline-block px-3 py-1 bg-brand-yellow/20 text-brand-yellow rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
                                        The Creator
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-white mb-3">{poll.restaurant.name}</h2>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {poll.restaurant.description}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-sm font-medium text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="w-5 h-5 text-brand-yellow" />
                                            {poll.restaurant.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <GlobeIcon className="w-5 h-5 text-brand-yellow" />
                                            {poll.restaurant.website}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="shrink-0">
                                    <button className="bg-white text-brand-black px-8 py-4 rounded-full font-bold hover:bg-brand-yellow transition-colors shadow-lg shadow-white/5">
                                        Book a Table
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* CONFIRMATION MODAL */}
                {showConfirmModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowConfirmModal(false)}></div>

                        {/* Content */}
                        <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center overflow-hidden">
                            <div className="w-16 h-16 bg-brand-yellow/10 text-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                                <FireIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-black mb-2">Confirm Your Vote</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Are you sure you want to vote for this item? This cannot be undone.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmVote}
                                    className="w-full bg-brand-black text-white py-3 rounded-xl font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors"
                                >
                                    Yes, submit vote
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="w-full bg-white border border-gray-200 text-gray-400 py-3 rounded-xl font-bold hover:text-brand-black hover:border-brand-black transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* THANK YOU POPUP MODAL */}
                {showThankYouModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowThankYouModal(false)}></div>

                        {/* Content */}
                        <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300 text-center overflow-hidden">

                            {/* Decor */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow"></div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <CheckIcon className="w-10 h-10" />
                                </div>

                                <h2 className="text-3xl font-extrabold text-brand-black mb-3">Vote Counted!</h2>
                                <p className="text-gray-500 font-medium mb-8">
                                    Thanks for helping {poll.restaurant.name} decide. The battle is heating up!
                                </p>

                                <div className="space-y-4">
                                    <a href={`/poll/${poll.id}/results`} className="block w-full bg-brand-black text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-brand-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                        See Live Results <ArrowRightIcon className="w-5 h-5" />
                                    </a>

                                    <button
                                        onClick={handleShare}
                                        className="block w-full bg-white border-2 border-gray-100 text-brand-black py-4 rounded-xl font-bold text-lg hover:border-brand-black transition-colors flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>Link Copied! <CheckIcon className="w-5 h-5 text-green-500" /></>
                                        ) : (
                                            <>Share with Friends <ShareIcon className="w-5 h-5" /></>
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowThankYouModal(false)}
                                    className="mt-6 text-sm text-gray-400 font-bold hover:text-brand-black transition-colors"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

