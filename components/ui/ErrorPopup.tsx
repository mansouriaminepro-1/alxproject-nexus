import React from 'react';
import { XIcon } from './icons';

// 🔹 Types
interface ErrorPopupProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type?: 'error' | 'warning';
}

// 🔹 Component
const ErrorPopup: React.FC<ErrorPopupProps> = ({
    isOpen,
    onClose,
    message,
    type = 'error'
}) => {
    // 🔹 Render Logic
    if (!isOpen) return null;

    // 🔹 UI Render
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4 animate-in zoom-in-95 duration-300">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">

                    {/* Decorative element */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${type === 'error' ? 'bg-brand-red/10' : 'bg-brand-yellow/10'} rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none`}></div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                    >
                        <XIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Content */}
                    <div className="p-10 text-center">

                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className={`w-20 h-20 rounded-full ${type === 'error' ? 'bg-brand-red/10' : 'bg-brand-yellow/10'} flex items-center justify-center`}>
                                <svg
                                    className={`w-10 h-10 ${type === 'error' ? 'text-brand-red' : 'text-brand-yellow'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Message */}
                        <h2 className="text-2xl font-extrabold text-brand-black mb-3">
                            {type === 'error' ? 'Oops!' : 'Hold On'}
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {message}
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-brand-black text-white py-4 px-6 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-brand-yellow hover:text-brand-black transition-all shadow-lg"
                        >
                            Got It
                        </button>

                        {type === 'error' && (
                            <p className="mt-6 text-xs text-gray-400 font-medium">
                                Please fix the issue and try again
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorPopup;
