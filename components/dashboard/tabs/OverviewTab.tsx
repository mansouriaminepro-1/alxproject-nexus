import React from 'react';
import Stats from '../Stats';
import RecentPolls from '../RecentPolls';

interface OverviewTabProps {
    data: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Row */}
            <Stats stats={data?.stats} />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Full Width: Active & Actions */}
                <div className="lg:col-span-3 space-y-8">
                    <RecentPolls polls={data?.activePolls || []} restaurantName={data?.owner?.restaurantName} />

                    {/* Quick Tips / Upsell Banner */}
                    <div className="bg-gradient-to-r from-brand-black to-gray-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group cursor-pointer">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-brand-yellow text-brand-black rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4">Pro Tip</span>
                            <h3 className="text-2xl font-bold mb-2">Want more local voters?</h3>
                            <p className="text-gray-400 mb-6 max-w-md">Boost your reach by 500% by enabling geolocation targeting on your next battle.</p>
                            <button className="text-brand-yellow font-bold border-b border-brand-yellow hover:text-white hover:border-white transition-colors pb-0.5">Upgrade to Premium</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
