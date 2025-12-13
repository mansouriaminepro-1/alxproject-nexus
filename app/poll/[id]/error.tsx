'use client';

// --- Component ---
export default function PollError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Poll</h1>
                <p className="text-gray-600 mb-6">
                    We couldn't load this poll. It may have been deleted or you may not have permission to view it.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
