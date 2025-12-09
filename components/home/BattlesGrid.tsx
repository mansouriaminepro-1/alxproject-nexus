import React from 'react';
import { ArrowRightIcon } from '../ui/icons';

const battles = [
    {
        id: 1,
        title: "Spicy vs Sweet",
        restaurant: "Pizza Paradise, NYC",
        status: "LIVE",
        leftOption: "Pepperoni Hot",
        rightOption: "Hawaiian",
        percentage: 72,
        barColor: "bg-black",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Cup Chocolate Ice Cream",
        restaurant: "Bakery Lane, LA",
        status: "ENDED",
        leftOption: "Chocolate",
        rightOption: "Vanilla",
        percentage: 45,
        barColor: "bg-[#C62626]", // Custom Brand Red
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGljZSUyMGNyZWFtfGVufDB8fDB8fHww"
    },
    {
        id: 3,
        title: "Bowl Battle",
        restaurant: "Fresh & Green, TX",
        status: "LIVE",
        leftOption: "Quinoa Power",
        rightOption: "Rice Delight",
        percentage: 60,
        barColor: "bg-brand-yellow",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const BattlesGrid = () => {
    return (
        <section id="live-battles" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex justify-between items-end mb-12 animate-fade-in-up">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                            Live Battles
                        </div>
                        <h2 className="text-[42px] font-black text-brand-black mb-2 tracking-tight">Active Battles</h2>
                        <p className="text-[16px] text-gray-500 font-medium">See what others are testing right now.</p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-[#C62626] font-bold hover:gap-3 transition-all">
                        View all battles <ArrowRightIcon className="w-4 h-4" />
                    </a>
                </div>

                {/* Battles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {battles.map((battle, idx) => (
                        <div
                            key={battle.id}
                            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 animate-fade-in-up"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Card Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={battle.image}
                                    alt={battle.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    {battle.status === 'LIVE' ? (
                                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C62626]"></span>
                                            </span>
                                            <span className="text-[10px] font-black tracking-widest uppercase text-[#C62626]">LIVE</span>
                                        </div>
                                    ) : (
                                        <div className="bg-brand-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-brand-yellow">ENDED</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-brand-black mb-1">{battle.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{battle.restaurant}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${battle.barColor}`}
                                        style={{ width: `${battle.percentage}%` }}
                                    ></div>
                                </div>

                                {/* Options Labels */}
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-brand-black">{battle.leftOption}</span>
                                    <span className="text-gray-400">{battle.rightOption}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-8 md:hidden text-center">
                    <a href="#" className="inline-flex items-center gap-2 text-[#C62626] font-bold">
                        View all battles <ArrowRightIcon className="w-4 h-4" />
                    </a>
                </div>

            </div>
        </section>
    );
};

export default BattlesGrid;