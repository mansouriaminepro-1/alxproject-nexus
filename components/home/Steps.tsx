
import React from 'react';
import NextImage from 'next/image';
import { ArrowRightIcon, PhotoIcon, BarChartIcon, ShareIcon, CheckIcon } from '../ui/icons';

const Steps = () => {
    return (
        <>
            {/* SECTION 1: Our Methodology (Original Section - Restored) */}
            <section id="about-us" className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Image Side - Organic Composition */}
                        <div className="relative order-2 lg:order-1">
                            <div className="relative z-10 pl-8">
                                {/* Main Image - Rotating plate/bowl concept */}
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Chef Cooking"
                                        className="rounded-[3rem] rotate-[-3deg] shadow-plate w-full max-w-md mx-auto lg:mx-0 relative z-10 border-4 border-white"
                                    />
                                    {/* Decorative Back Shape */}
                                    <div className="absolute top-4 -left-4 w-full h-full bg-brand-yellow rounded-[3rem] rotate-[-6deg] -z-10"></div>
                                </div>

                                {/* Overlapping Badge Image */}
                                <div className="absolute -bottom-10 -right-4 md:right-10 w-48 h-48 bg-white p-3 rounded-full shadow-xl hidden md:block z-20">
                                    <img
                                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                        alt="Healthy Ingredients"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    <div className="absolute top-0 right-0 bg-brand-black text-white text-xs font-bold px-3 py-1 rounded-full">Real Data</div>
                                </div>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand-black text-white">
                                <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
                                <span className="font-bold text-xs uppercase tracking-widest">Our Methodology</span>
                            </div>

                            <h2 className="text-[42px] font-semibold text-brand-black mb-8 leading-tight animate-fade-in-up animation-delay-100">
                                We turned "gut feel" into a <br />
                                <span className="text-brand-yellow inline-block bg-brand-black px-2 transform -rotate-1">science.</span>
                            </h2>

                            <p className="text-[#333333]/70 mb-6 text-[16px] leading-relaxed font-normal animate-fade-in-up animation-delay-200">
                                Just like a family shop knows its regulars, MenuFight helps you know your customers before they even walk in.
                                We simulate the "regular" experience at scale by putting your menu concepts in front of real local voters.
                            </p>

                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 animate-fade-in-up animation-delay-300">
                                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-brand-black font-bold text-xs">1</div>
                                    <span className="text-brand-black font-normal">Create 1-vs-1 image polls</span>
                                </li>
                                <li className="flex items-center gap-3 animate-fade-in-up animation-delay-400">
                                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-brand-black font-bold text-xs">2</div>
                                    <span className="text-brand-black font-normal">Share with your local audience</span>
                                </li>
                                <li className="flex items-center gap-3 animate-fade-in-up animation-delay-500">
                                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-brand-black font-bold text-xs">3</div>
                                    <span className="text-brand-black font-normal">Launch the winner with confidence</span>
                                </li>
                            </ul>

                            <button className="bg-brand-black text-white px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-brand-yellow hover:text-brand-black transition-colors">
                                How it works
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 2: Create Battle Step */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text Content */}
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                                Step 1: The Setup
                            </div>

                            <h2 className="text-[42px] font-bold text-brand-black mb-6 leading-[1.1]">
                                Start a food fight in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-red-600">seconds.</span>
                            </h2>

                            <p className="text-[16px] text-gray-500 mb-12 leading-relaxed max-w-xl">
                                Stop overthinking your menu. Just upload two photos, add a catchy question, and set the duration. It's as easy as posting to Instagram, but with powerful data analytics attached.
                            </p>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-black mb-1">Visual First</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">High-res support for mouth-watering presentation.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-black mb-1">Drag & Drop</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Seamless uploads from desktop or mobile.</p>
                                    </div>
                                </div>
                            </div>

                            <a href="#" className="inline-flex items-center gap-2 text-brand-black font-bold hover:gap-3 transition-all group border-b-2 border-brand-black pb-1">
                                Try the Editor
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Right: Browser Mockup - CREATE BATTLE INTERFACE */}
                        <div className="animate-fade-in-up animation-delay-200">
                            <div className="relative mx-auto w-full max-w-4xl">
                                {/* Browser Window */}
                                <div className="rounded-lg bg-[#2a2a2a] shadow-2xl overflow-hidden border border-gray-700">
                                    {/* Browser Header */}
                                    <div className="bg-[#1e1e1e] px-3 py-1.5 flex items-center gap-2 border-b border-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                                        <div className="ml-2 flex-1 bg-[#2a2a2a] rounded px-2 py-0.5 text-[9px] text-gray-500 font-mono">
                                            menufight.com/create-battle
                                        </div>
                                    </div>

                                    {/* Browser Content - CREATE BATTLE FORM */}
                                    <div className="bg-white p-6">
                                        {/* Header */}
                                        <div className="mb-4 flex justify-between items-end">
                                            <div>
                                                <h3 className="text-lg font-bold text-brand-black mb-0.5">Create New Battle</h3>
                                                <p className="text-[10px] text-gray-500">Upload two menu items and let customers pick the winner</p>
                                            </div>
                                            <button className="bg-brand-red text-white px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] shadow-sm hover:bg-brand-red/90 transition-colors">
                                                Launch Battle →
                                            </button>
                                        </div>

                                        {/* Inputs Row */}
                                        <div className="grid grid-cols-12 gap-4 mb-4">
                                            {/* Battle Name */}
                                            <div className="col-span-8">
                                                <label className="block text-[9px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Battle Name</label>
                                                <div className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-xs text-brand-black font-medium">
                                                    Summer Menu Showdown
                                                </div>
                                            </div>
                                            {/* Duration */}
                                            <div className="col-span-4">
                                                <label className="block text-[9px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Duration</label>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-2 border-2 border-brand-black bg-brand-black text-white rounded-lg text-[10px] font-bold">24h</button>
                                                    <button className="flex-1 py-2 border border-gray-200 bg-white text-gray-600 rounded-lg text-[10px] font-semibold">3d</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Upload Cards - Landscape Aspect Ratio */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Option A - With Image */}
                                            <div className="border-2 border-brand-red rounded-xl p-3 bg-brand-red/5 relative">
                                                <div className="absolute -top-2 left-3 bg-brand-red text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider z-10">
                                                    Option A
                                                </div>
                                                <div className="aspect-[3/2] bg-white rounded-lg mb-2 overflow-hidden border-2 border-dashed border-brand-red/30 relative">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop"
                                                        alt="Truffle Burger"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-brand-black">Truffle Smash</span>
                                                    <div className="w-4 h-4 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Option B - Upload State */}
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/50 relative hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <div className="absolute -top-2 left-3 bg-gray-600 text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider z-10">
                                                    Option B
                                                </div>
                                                <div className="aspect-[3/2] bg-white rounded-lg mb-2 overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group-hover:border-gray-300 transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                                        <PhotoIcon className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Drag & Drop Image</span>
                                                </div>
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 3: Engage Your Fans (Step 2) - YELLOW THEME, ALTERNATE LAYOUT */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Browser Mockup - LIVE BATTLE INTERFACE */}
                        <div className="order-2 lg:order-1 animate-fade-in-up">
                            <div className="relative mx-auto w-full max-w-4xl">
                                {/* Browser Window */}
                                <div className="rounded-xl bg-[#1a1a1a] shadow-2xl overflow-hidden border border-gray-800">
                                    {/* Browser Header */}
                                    <div className="bg-[#2d2d2d] px-3 py-2 flex items-center gap-2 border-b border-gray-700">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                        <div className="ml-3 flex-1 bg-[#1a1a1a] rounded px-3 py-1 text-[10px] text-gray-500 font-mono">
                                            menufight.com/vote/summer-showdown
                                        </div>
                                    </div>

                                    {/* Browser Content - LIVE VOTE */}
                                    <div className="bg-white p-6 relative">
                                        {/* Live Badge */}
                                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-brand-yellow/10 text-brand-black px-2 py-1 rounded border border-brand-yellow/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Ends in 22h</span>
                                        </div>

                                        {/* Header */}
                                        <div className="mb-6 text-center">
                                            <h3 className="text-xl font-bold text-brand-black mb-1">Summer Menu Showdown</h3>
                                            <p className="text-xs text-gray-500">Vote for the item you want to see on our menu!</p>
                                        </div>

                                        {/* VS Grid */}
                                        <div className="grid grid-cols-2 gap-4 relative">
                                            {/* VS Badge Center */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 z-10">
                                                <span className="text-brand-yellow font-black text-xs italic">VS</span>
                                            </div>

                                            {/* Option A */}
                                            <div className="group cursor-pointer">
                                                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden border-2 border-transparent group-hover:border-brand-yellow/30 transition-all relative">
                                                    <img
                                                        src="https://images.pexels.com/photos/19671301/pexels-photo-19671301.jpeg"
                                                        alt="Classic Crispy"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-16 opacity-60"></div>
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-bold text-brand-black text-sm mb-2">Classic Crispy</h4>
                                                    <button className="w-full bg-brand-yellow text-brand-black py-1.5 rounded font-bold uppercase tracking-wider text-[10px] hover:bg-yellow-400 transition-colors shadow-sm">
                                                        Vote
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Option B */}
                                            <div className="group cursor-pointer">
                                                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden border-2 border-transparent group-hover:border-brand-yellow/30 transition-all relative">
                                                    <img
                                                        src="https://images.pexels.com/photos/4421615/pexels-photo-4421615.jpeg"
                                                        alt="Double Smash"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-16 opacity-60"></div>
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-bold text-brand-black text-sm mb-2">Double Smash</h4>
                                                    <button className="w-full border-2 border-gray-200 text-gray-400 py-1.5 rounded font-bold uppercase tracking-wider text-[10px] group-hover:border-brand-yellow group-hover:text-brand-black transition-colors">
                                                        Vote
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="order-1 lg:order-2 animate-fade-in-up animation-delay-100">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand-yellow/10">
                                <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
                                <span className="font-bold text-brand-black text-xs uppercase tracking-widest">STEP 2: THE REACH</span>
                            </div>

                            <h2 className="text-[42px] font-bold text-brand-black mb-6 leading-tight">
                                Turn your regulars into <span className="text-brand-yellow">promoters.</span>
                            </h2>

                            <p className="text-[16px] text-gray-500 mb-10 leading-relaxed">
                                No apps to download. No sign-ups required for voters. Just a simple link or QR code that works instantly on any device. Place it on tables, receipts, or your Instagram story.
                            </p>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <img
                                            src="https://img.icons8.com/?size=100&id=2v21YBRbFlfU&format=png&color=000000"
                                            alt="QR Code"
                                            className="w-6 h-6 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-black mb-1">Table Talkers</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Auto-generated QR codes ready for print.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-black mb-1">Social Ready</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Optimized links for IG Stories and TikTok.</p>
                                    </div>
                                </div>
                            </div>

                            <a href="#" className="inline-flex items-center gap-2 text-brand-black font-bold hover:gap-3 transition-all group">
                                See Share Options
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: Pick the Winner (Step 3) - YELLOW THEME, STANDARD LAYOUT */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text Content */}
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand-red/10">
                                <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                                <span className="font-bold text-brand-red text-xs uppercase tracking-widest">STEP 3: THE VERDICT</span>
                            </div>

                            <h2 className="text-[42px] font-bold text-brand-black mb-6 leading-tight">
                                Data that actually <span className="text-brand-red">tastes good.</span>
                            </h2>

                            <p className="text-[16px] text-gray-500 mb-10 leading-relaxed">
                                Your dashboard gives you real-time insight into what the community is craving. Watch votes pour in and make decisions backed by hard numbers, not just gut feeling.
                            </p>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-black mb-1">Real-time Analytics</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Live vote tracking and winner projection.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-6 h-6 text-brand-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-black mb-1">Clear Winners</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Instant statistical significance calculation.</p>
                                    </div>
                                </div>
                            </div>

                            <a href="#" className="inline-flex items-center gap-2 text-brand-black font-bold hover:gap-3 transition-all group">
                                View Live Demo
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Right: Browser Mockup - RESULTS DASHBOARD */}
                        <div className="animate-fade-in-up animation-delay-200">
                            <div className="relative mx-auto w-full max-w-4xl">
                                {/* Browser Window */}
                                <div className="rounded-xl bg-[#1a1a1a] shadow-2xl overflow-hidden border border-gray-800">
                                    {/* Browser Header */}
                                    <div className="bg-[#2d2d2d] px-3 py-2 flex items-center gap-2 border-b border-gray-700">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                        <div className="ml-3 flex-1 bg-[#1a1a1a] rounded px-3 py-1 text-[10px] text-gray-500 font-mono">
                                            menufight.com/dashboard/results
                                        </div>
                                    </div>

                                    {/* Browser Content - DASHBOARD */}
                                    <div className="bg-white p-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-brand-black mb-1">Campaign Results</h3>
                                                <p className="text-xs text-gray-500">Summer Menu Testing • <span className="text-green-500 font-semibold">Live Now</span></p>
                                            </div>
                                            <button className="bg-brand-black text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                                                Export Report
                                            </button>
                                        </div>

                                        {/* Results Cards */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            {/* Winner Card */}
                                            <div className="border-2 border-brand-red/50 bg-brand-red/5 rounded-xl p-3 relative">
                                                <div className="absolute -top-3 left-3 bg-brand-red text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                    Leading
                                                </div>
                                                <div className="flex gap-3 items-center mb-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop"
                                                            alt="Wagyu"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-brand-black text-sm">Wagyu Smash</h4>
                                                        <span className="text-xl font-black text-brand-red">62%</span>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-red w-[62%] rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Loser Card */}
                                            <div className="border border-gray-200 rounded-xl p-3">
                                                <div className="flex gap-3 items-center mb-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                        <img
                                                            src="/pink-burger.png"
                                                            alt="Classic"
                                                            className="w-full h-full object-cover grayscale"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-500 text-sm">Classic Single</h4>
                                                        <span className="text-xl font-black text-gray-400">38%</span>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gray-400 w-[38%] rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Votes</div>
                                                <div className="text-lg font-black text-brand-black">1,420</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Engagement</div>
                                                <div className="text-lg font-black text-green-500">High</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Conversion</div>
                                                <div className="text-lg font-black text-brand-black">12.5%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Steps;
