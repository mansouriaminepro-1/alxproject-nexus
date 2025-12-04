import React from 'react';

interface SettingsTabProps {
    data: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ data }) => {
    return (
        <div className="max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
            <h2 className="text-2xl font-bold text-brand-black mb-8">Account Settings</h2>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-gray-100 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b border-gray-100 pb-2">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Restaurant Name</label>
                            <input type="text" defaultValue={data?.owner?.restaurantName || 'My Restaurant'} className="w-full font-bold text-brand-black border-b border-gray-200 focus:outline-none focus:border-brand-yellow py-1" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                            <input type="text" defaultValue={data?.owner?.email || ''} placeholder="user@example.com" className="w-full font-bold text-brand-black border-b border-gray-200 focus:outline-none focus:border-brand-yellow py-1" />
                        </div>
                    </div>
                </div>

                <button className="w-full bg-brand-black text-white py-3 rounded-xl font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
