'use client';

import React, { useState } from 'react';

// 🔹 Icons
// Icons components defined locally for self-containment
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const StoreIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m19.28 0H17.5m-8.5-7.5h8.5l1.15 4.75h-10.8l1.15-4.75zM2 21h20M2.25 13.5l1.65-6.877a2.25 2.25 0 012.185-1.723h11.83a2.25 2.25 0 012.185 1.723L21.75 13.5" />
    </svg>
);

const EnvelopeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

// 🔹 Types
interface SettingsTabProps {
    data: any;
}

// 🔹 Component
const SettingsTab: React.FC<SettingsTabProps> = ({ data }) => {
    // 🔹 State
    // Initialize state with data or fallbacks
    // Note: data.owner.name from API is a fallback-heavy string. 
    // Ideally we would want the raw owner_name, but we can assume 'name' is the intended display name.
    const [restaurantName, setRestaurantName] = useState(data?.owner?.restaurantName || '');
    const [ownerName, setOwnerName] = useState(data?.owner?.name || '');
    const [email] = useState(data?.owner?.email || '');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

    // 🔹 Handlers
    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ownerName,
                    restaurantName,
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Optional: Reload page to reflect changes in Header? 
                // Or user will see it pending navigation. 
                // A reload ensures global state (like the header greeting) is updated.
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    // 🔹 Render
    return (
        <div className="max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
            <h2 className="text-2xl font-bold text-brand-black mb-8">Account Settings</h2>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-gray-100 space-y-8">

                {/* Profile Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-gray-100 pb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-brand-yellow" />
                        Profile Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Restaurant Name */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <StoreIcon className="w-3 h-3" />
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className="w-full font-bold text-brand-black text-lg border-b-2 border-gray-100 focus:border-brand-yellow focus:outline-none transition-colors py-2 bg-transparent"
                                placeholder="Enter restaurant name"
                            />
                        </div>

                        {/* Owner Name */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <UserIcon className="w-3 h-3" />
                                Owner Name
                            </label>
                            <input
                                type="text"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                className="w-full font-bold text-brand-black text-lg border-b-2 border-gray-100 focus:border-brand-yellow focus:outline-none transition-colors py-2 bg-transparent"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Email - Read Only */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <EnvelopeIcon className="w-3 h-3" />
                                Email Address
                            </label>
                            <input
                                type="text"
                                value={email}
                                disabled
                                className="w-full font-medium text-gray-500 border-b border-gray-100 py-2 bg-transparent cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        )}
                        {message.text}
                    </div>
                )}

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-brand-black text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-brand-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;

