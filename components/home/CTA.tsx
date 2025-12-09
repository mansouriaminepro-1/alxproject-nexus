
import React from 'react';
import { ArrowRightIcon } from '../ui/icons';

interface CTAProps {
    href?: string;
    label?: string;
}

const CTA = ({ href = "/create-poll", label = "Get Started Free" }: CTAProps) => {
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-brand-black rounded-5xl p-12 md:p-24 relative overflow-hidden text-center">

                    {/* Decorative Globs */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-brand-red rounded-full filter blur-[80px] opacity-40"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-yellow/50 rounded-full filter blur-[80px] opacity-30"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-[42px] font-bold text-white mb-8 tracking-tight">
                            Ready to validate your next bestseller?
                        </h2>
                        <p className="text-gray-400 text-[16px] mb-10">
                            Join the community of restaurateurs who stopped guessing. Start your first battle today.
                        </p>

                        <div className="flex items-center justify-center">
                            <a href="/create-poll" className="bg-brand-yellow hover:bg-white text-brand-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                                Get Started Free
                                <ArrowRightIcon className="w-5 h-5" />
                            </a>
                        </div>

                        <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
