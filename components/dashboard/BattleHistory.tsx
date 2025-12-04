
import React from 'react';
import Image from 'next/image';
import { TrophyIcon, CheckIcon, ArrowRightIcon } from '../ui/icons';

interface BattleHistoryProps {
  polls: any[];
  fullPage?: boolean;
}

const BattleHistory: React.FC<BattleHistoryProps> = ({ polls, fullPage = false }) => {
  return (
    <div className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-card overflow-hidden ${fullPage ? '' : 'h-full'}`}>
      <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-brand-black">Battle History</h3>
        {!fullPage && (
          <button className="text-gray-400 hover:text-brand-black transition-colors">
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {polls.length === 0 ? (
        <div className="p-8 text-center text-gray-400 font-bold text-sm">No completed battles yet.</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {polls.map((item) => (
            <a href={`/poll/${item.id}/results`} key={item.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group block">

              {/* Image */}
              <div className="relative w-16 h-16 shrink-0">
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.title} className="w-full h-full rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="absolute -top-2 -right-2 bg-brand-yellow text-brand-black p-1 rounded-full shadow-md">
                  <TrophyIcon className="w-3 h-3" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-brand-black text-lg truncate">{item.title}</h4>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mt-1">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-brand-green flex items-center gap-1">
                    <CheckIcon className="w-3 h-3" /> Completed
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right pl-4">
                <p className="text-2xl font-extrabold text-brand-black group-hover:text-brand-yellow transition-colors">{item.totalVotes}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Votes</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {!fullPage && polls.length > 0 && (
        <div className="p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-100">
          <span className="text-xs font-bold text-brand-black uppercase tracking-widest">View All Archives</span>
        </div>
      )}
    </div>
  );
};

export default BattleHistory;
