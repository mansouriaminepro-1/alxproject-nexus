
import React from 'react';
import { FireIcon, TrophyIcon, UsersIcon, TrendingUpIcon, CrownIcon } from '../ui/icons';

interface StatsProps {
  stats?: {
    totalVotes: number;
    menuWins: number;
    activeReach: number;
  };
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const data = [
    {
      label: 'Total Votes',
      value: stats?.totalVotes?.toLocaleString() || '0',
      trend: 'Live',
      trendUp: true,
      icon: <FireIcon className="w-6 h-6 text-white" />,
      color: 'bg-brand-red'
    },
    {
      label: 'Completed Battles',
      value: stats?.menuWins?.toString() || '0',
      trend: 'Success',
      trendUp: true,
      icon: <CrownIcon className="w-6 h-6 text-brand-black" />,
      color: 'bg-brand-yellow'
    },
    {
      label: 'Active Reach',
      value: stats?.activeReach?.toLocaleString() || '0',
      trend: 'Locals',
      trendUp: true,
      icon: <UsersIcon className="w-6 h-6 text-white" />,
      color: 'bg-brand-black'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {data.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-soft hover:shadow-plate transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${stat.color} transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-brand-red/10 text-brand-red'}`}>
              <TrendingUpIcon className="w-3 h-3" />
              {stat.trend}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-extrabold text-brand-black">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
