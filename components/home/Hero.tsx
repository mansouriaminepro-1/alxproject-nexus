"use client";


import NextImage from 'next/image';
import { ArrowRightIcon, TrophyIcon, FireIcon } from '../ui/icons';

const Hero = () => {
    const handleStartBattle = async () => {
        // Check if user is authenticated
        try {
            const res = await fetch('/api/dashboard');
            if (res.status === 401) {
                // Not authenticated - open login modal
                window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'login' }));
                return;
            }
            // Authenticated - go to create poll
            window.location.href = '/create-poll';
        } catch (e) {
            console.error('Auth check failed:', e);
            // On error, open login modal
            window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'login' }));
        }
    };

    return (
        <section id="how-it-works" className="relative pt-32 pb-20 lg:pt-40 lg:pb-48 overflow-hidden bg-gradient-to-br from-[#FDD835] via-[#FDD835] to-[#fe4a49]">

            {/* Background: Dot Pattern for Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-10 animate-background-move"
                style={{
                    backgroundImage: 'radial-gradient(#111111 1.5px, transparent 1.5px)',
                    backgroundSize: '32px 32px'
                }}>
            </div>

            {/* Background: Catchy Animated Gradient Blobs */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/20 rounded-full blur-3xl animate-pulse pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content - Typography */}
                    <div className="text-left relative z-20">
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-brand-black/10 bg-white/40 backdrop-blur-sm shadow-sm animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-bold text-brand-black text-xs tracking-wide uppercase">For Modern Kitchens</span>
                        </div>

                        <h1 className="text-[63px] text-brand-black mb-6 leading-[1.1] tracking-tight animate-fade-in-up animation-delay-100">
                            <span className="font-extrabold block">Stop Guessing.</span>
                            <span className="relative inline-block z-10 font-extrabold">
                                Start Winning.
                                {/* Underline SVG */}
                                <svg className="absolute bottom-2 left-0 w-full h-4 text-white -z-10 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 15 100 5" fill="currentColor" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-[16px] text-brand-black/80 mb-10 max-w-lg leading-relaxed font-medium animate-fade-in-up animation-delay-200">
                            The smartest way to test new menu items. Put your ideas in the ring and let real local customers pick the winner.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-in-up animation-delay-300">
                            <button
                                onClick={handleStartBattle}
                                className="group bg-brand-black text-white px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:bg-gray-900"
                            >
                                <span className="bg-brand-yellow text-brand-black rounded-full p-1 w-6 h-6 flex items-center justify-center group-hover:rotate-[-45deg] transition-transform duration-300"><ArrowRightIcon className="w-4 h-4" /></span>
                                Start a Battle
                            </button>

                            <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity cursor-pointer group">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-yellow bg-gray-200 overflow-hidden relative z-0 group-hover:z-10 hover:scale-110 transition-all duration-300">
                                            <NextImage
                                                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                                alt="user"
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs font-bold text-brand-black leading-tight">
                                    Join 2,000+<br />Smart Restaurateurs
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - The "Card Battle" Visual */}
                    <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center perspective-1000">

                        {/* Glow behind composition */}
                        <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl scale-75 animate-pulse"></div>

                        {/* Card Container - Floating Animation */}
                        <div className="relative w-[280px] md:w-[320px] h-[400px] md:h-[460px] animate-float">

                            {/* CARD B (Loser) - Background Layer */}
                            <div className="absolute top-6 right-[-14px] w-full h-full rounded-[2rem] bg-white shadow-2xl transform rotate-6 hover:rotate-12 transition-all duration-500 overflow-hidden border-[5px] border-white group">
                                <NextImage
                                    src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                    alt="Classic Burger"
                                    fill
                                    sizes="(max-width: 768px) 250px, 320px"
                                    className="object-cover"
                                />
                                {/* Dark Overlay for Text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                {/* Stats Overlay B */}
                                <div className="absolute bottom-6 left-6 right-6 z-20">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">Challenger</p>
                                            <h3 className="text-white font-bold text-lg">Classic BBQ</h3>
                                        </div>
                                        <span className="text-white/70 font-bold text-xl">32%</span>
                                    </div>
                                </div>
                            </div>

                            {/* CARD A (Winner) - Foreground Layer */}
                            <div className="absolute top-0 left-[-14px] w-full h-full rounded-[2rem] bg-brand-black shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform -rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden border-[5px] border-white z-20 group">
                                <NextImage
                                    src="/pexels-david-geib-1265112-3220617.jpg"
                                    alt="Truffle Smash"
                                    fill
                                    sizes="(max-width: 768px) 250px, 320px"
                                    className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                {/* Winner Badge */}
                                <div className="absolute top-5 left-5 bg-brand-yellow text-brand-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg ring-2 ring-white/20">
                                    <TrophyIcon className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Winner</span>
                                </div>

                                {/* Stats Overlay A */}
                                <div className="absolute bottom-8 left-6 right-6 text-white">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-brand-yellow text-[10px] font-bold uppercase tracking-wider mb-1">Champion</p>
                                            <h3 className="text-white font-extrabold text-3xl leading-none shadow-black drop-shadow-lg">Truffle Smash</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                            <div className="w-[68%] h-full bg-brand-yellow shadow-[0_0_10px_rgba(253,216,53,0.5)]"></div>
                                        </div>
                                        <div className="text-right leading-none">
                                            <span className="block text-2xl font-black text-brand-yellow">68%</span>
                                            <span className="text-white/60 text-[8px] uppercase font-bold tracking-widest">Votes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Insight Pop-up - Bottom Right */}
                            <div className="absolute top-[60%] -right-32 -translate-y-1/2 bg-white p-4 rounded-3xl shadow-xl z-30 max-w-[200px] animate-[float_4s_ease-in-out_infinite] hidden md:block border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                                        <FireIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-black leading-tight mb-1">New Insight</p>
                                        <p className="text-[10px] text-gray-500 font-medium leading-normal">Spicy option trending +15% this week.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;