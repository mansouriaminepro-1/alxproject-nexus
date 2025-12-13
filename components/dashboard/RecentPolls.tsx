import React, { useState } from 'react';
import Image from 'next/image';
import { BarChartIcon, CalendarIcon, LinkIcon, TrashIcon, TrophyIcon, FireIcon, CheckIcon } from '../ui/icons';

// 🔹 Types
interface PollItem {
  id: string;
  name: string;
  image: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  title: string;
  status: string;
  endsIn: string;
  totalVotes: number;
  date: string;
  items: PollItem[];
  winRate: string;
}

interface RecentPollsProps {
  polls: Poll[];
  restaurantName?: string;
}

// 🔹 Component
const RecentPolls: React.FC<RecentPollsProps> = ({ polls, restaurantName }) => {
  // 🔹 State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null); // New state for modal

  // 🔹 Handlers
  const handleShare = (e: React.MouseEvent, pollId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(pollId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Opens the delete confirmation modal
  const handleDelete = (e: React.MouseEvent, pollId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPollToDelete(pollId);
  };

  // Executes the deletion
  const confirmDelete = async () => {
    if (!pollToDelete) return;

    setIsDeleting(pollToDelete);
    try {
      const res = await fetch(`/api/polls/${pollToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Clear cache to force fresh data on reload
        sessionStorage.removeItem('dashboard_data');
        window.location.reload();
      } else {
        alert('Failed to delete battle.');
        setIsDeleting(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting.');
    }
  };

  // 🔹 Render (Empty State)
  if (!polls || polls.length === 0) {
    return (
      <div className="mb-12 p-8 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center shadow-soft">
        <h3 className="text-lg font-bold text-gray-400">No active battles. Start one now!</h3>
      </div>
    );
  }

  // 🔹 Render (Main)
  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-8">
        <h3 className="text-2xl font-extrabold text-brand-black flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-brand-green animate-pulse"></span>
          Live Battles
        </h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {polls.map((poll) => {
          const item1 = poll.items?.[0];
          const item2 = poll.items?.[1];
          const item1Percent = item1?.percentage || 0;
          const item2Percent = item2?.percentage || 0;

          return (
            <div key={poll.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border-4 border-white hover:border-brand-yellow/20">

              {/* Images Container with Gradient Overlay */}
              <div className="relative h-64 flex bg-gray-100">
                {/* Item 1 Image */}
                <div className="w-1/2 h-full relative overflow-hidden">
                  {item1?.image ? (
                    <>
                      <Image
                        src={item1.image}
                        alt={item1.name || 'Item 1'}
                        fill
                        sizes="(max-width: 768px) 150px, 200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <p className="text-brand-yellow text-[10px] font-bold uppercase tracking-widest mb-1">Item A</p>
                        <h4 className="text-white font-extrabold text-base leading-tight line-clamp-1">{item1.name}</h4>
                        <span className="block text-4xl font-black text-brand-yellow mt-1">{poll.totalVotes === 0 ? 50 : item1Percent}%</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">No Image</div>
                  )}
                </div>

                {/* Item 2 Image */}
                <div className="w-1/2 h-full relative overflow-hidden">
                  {item2?.image ? (
                    <>
                      <Image
                        src={item2.image}
                        alt={item2.name || 'Item 2'}
                        fill
                        sizes="(max-width: 768px) 150px, 200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest mb-1">Item B</p>
                        <h4 className="text-white font-extrabold text-base leading-tight line-clamp-1">{item2.name}</h4>
                        <span className="block text-4xl font-black mt-1 text-[#FB2C36]">{poll.totalVotes === 0 ? 50 : item2Percent}%</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">No Image</div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  {poll.status === 'Active' ? (
                    <div className="bg-brand-red text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <FireIcon className="w-4 h-4" />
                      <span className="text-xs font-extrabold uppercase tracking-wider">Live</span>
                    </div>
                  ) : (
                    <div className="bg-gray-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <TrophyIcon className="w-4 h-4" />
                      <span className="text-xs font-extrabold uppercase tracking-wider">Ended</span>
                    </div>
                  )}
                </div>

                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-16 h-16 bg-brand-yellow rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <span className="font-black italic text-2xl text-brand-black">VS</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Restaurant Name */}
                <div className="text-brand-yellow text-[10px] font-bold uppercase tracking-widest mb-2">
                  {restaurantName || 'My Restaurant'}
                </div>

                {/* Battle Title */}
                <h3 className="text-brand-black font-extrabold text-xl leading-tight mb-4 line-clamp-2 min-h-[3.5rem]">
                  {poll.title}
                </h3>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <FireIcon className="w-4 h-4 text-brand-red" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{poll.totalVotes} votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{poll.date}</span>
                  </div>
                </div>

                {/* Vote Distribution Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vote Distribution</span>
                    <span className="text-sm font-black">
                      <span style={{ color: item1Percent >= item2Percent ? '#FDD835' : '#6B7280' }}>{poll.totalVotes === 0 ? 50 : item1Percent}%</span>
                      <span className="text-gray-400"> vs </span>
                      <span style={{ color: item2Percent > item1Percent ? '#FB2C36' : '#6B7280' }}>{poll.totalVotes === 0 ? 50 : item2Percent}%</span>
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden shadow-inner flex">
                    <div
                      style={{
                        width: `${poll.totalVotes === 0 ? 50 : item1Percent}%`,
                        background: 'linear-gradient(90deg, #FDD835 0%, #FBC02D 100%)',
                        boxShadow: '0 0 8px rgba(253, 216, 53, 0.4)'
                      }}
                      className="h-full transition-all duration-1000 ease-out"
                    ></div>
                    <div
                      style={{
                        width: `${poll.totalVotes === 0 ? 50 : item2Percent}%`,
                        background: 'linear-gradient(90deg, #FB2C36 0%, #D32F2F 100%)',
                        boxShadow: '0 0 8px rgba(251, 44, 54, 0.4)'
                      }}
                      className="h-full transition-all duration-1000 ease-out"
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={`/poll/${poll.id}/results`}
                    className="flex-1 bg-brand-black text-white font-bold py-3 px-4 rounded-full hover:bg-brand-yellow hover:text-brand-black transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <BarChartIcon className="w-5 h-5" />
                    View Results
                  </a>
                  <button
                    onClick={(e) => handleShare(e, poll.id)}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-full hover:border-brand-yellow hover:bg-brand-yellow/10 transition-all group/btn"
                    title="Copy Link"
                  >
                    {copiedId === poll.id ? (
                      <CheckIcon className="w-5 h-5 text-brand-green" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-brand-yellow" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, poll.id)}
                    disabled={isDeleting === poll.id}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-full hover:border-brand-red hover:bg-brand-red/10 transition-all group/btn disabled:opacity-50"
                    title="Delete Battle"
                  >
                    <TrashIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-brand-red" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {pollToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !isDeleting && setPollToDelete(null)}></div>

          {/* Content */}
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center overflow-hidden">
            <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <TrashIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-black mb-2">Delete Battle?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this battle? This action cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                disabled={!!isDeleting}
                className="w-full bg-brand-red text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Battle'}
              </button>
              <button
                onClick={() => setPollToDelete(null)}
                disabled={!!isDeleting}
                className="w-full bg-white border border-gray-200 text-gray-400 py-3 rounded-xl font-bold hover:text-brand-black hover:border-brand-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentPolls;
