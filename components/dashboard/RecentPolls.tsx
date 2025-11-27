
import React from 'react';
import { ClockIcon, FireIcon, ArrowRightIcon } from '../ui/icons';

interface RecentPollsProps {
  polls: any[];
}

const RecentPolls: React.FC<RecentPollsProps> = ({ polls }) => {
  if (!polls || polls.length === 0) {
      return (
          <div className="mb-12 p-8 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
              <h3 className="text-lg font-bold text-gray-400">No active battles. Start one now!</h3>
          </div>
      );
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-bold text-brand-black flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
          Live Now
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <a key={poll.id} href={`/poll/${poll.id}/results`} className="bg-white rounded-[2rem] p-6 border border-brand-yellow/30 shadow-soft hover:shadow-card transition-all duration-300 group relative overflow-hidden block">
            
            {/* Live Indicator Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-bl-[4rem] pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h4 className="font-extrabold text-lg text-brand-black line-clamp-1">{poll.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      <ClockIcon className="w-3 h-3" /> {poll.endsIn}
                   </div>
                   <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <FireIcon className="w-3 h-3" /> {poll.totalVotes} votes
                   </div>
                </div>
              </div>
              <div className="bg-brand-black text-white rounded-full p-2 group-hover:bg-brand-yellow group-hover:text-brand-black transition-colors">
                  <ArrowRightIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Visual Bar - Simplified for dynamic data */}
            <div className="relative h-24 rounded-2xl overflow-hidden flex bg-gray-100">
                <img src={poll.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover filter brightness-90" alt="Poll Preview" />
                <div className="absolute inset-0 bg-brand-black/20 flex items-center justify-center">
                    <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">View Results</span>
                </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentPolls;
