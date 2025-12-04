import React from 'react';
import { ClockIcon } from '../../ui/icons';

interface AnalyticsTabProps {
    setActiveTab: (tab: string) => void;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ setActiveTab }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-brand-yellow/10 rounded-full flex items-center justify-center mb-6 text-brand-yellow">
                <ClockIcon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-brand-black mb-2">Analytics Deep Dive</h2>
            <p className="text-gray-500 max-w-md mb-8">Detailed demographic breakdowns and flavor profile trends are coming in the next update.</p>
            <button onClick={() => setActiveTab('overview')} className="text-brand-black font-bold border-b-2 border-brand-black hover:text-brand-yellow hover:border-brand-yellow transition-colors">
                Return to Dashboard
            </button>
        </div>
    );
};

export default AnalyticsTab;
