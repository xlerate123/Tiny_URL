'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, ExternalLink, Calendar, MousePointerClick } from 'lucide-react';

interface Link {
    id: number;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    lastClickedAt: string | null;
    createdAt: string;
}

export default function StatsPage() {
    const params = useParams();
    const router = useRouter();
    const code = params?.code as string;
    const [link, setLink] = useState<Link | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shortUrl = `${baseUrl}/${code}`;

    useEffect(() => {
        if (code) {
            fetchLinkStats();
        }
    }, [code]);

    const fetchLinkStats = async () => {
        try {
            const res = await fetch(`/api/links/${code}`);
            if (!res.ok) {
                setError('Link not found');
                setLoading(false);
                return;
            }
            const data = await res.json();
            setLink(data);
        } catch (err) {
            setError('Error loading stats');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{error || 'Link not found'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors animate-fade-in"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Link Statistics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Detailed analytics for your shortened link
                    </p>
                </div>

                {/* Short URL Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Short URL
                    </label>
                    <div className="flex items-center gap-3">
                        <code className="flex-1 text-lg font-mono bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            {shortUrl}
                        </code>
                        <button
                            onClick={copyToClipboard}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg transition-all shadow-lg"
                            title="Copy to clipboard"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-all"
                            title="Visit short URL"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                    {copied && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                            Copied to clipboard!
                        </p>
                    )}
                </div>

                {/* Original URL Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Original URL
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 break-all">
                        <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            {link.originalUrl}
                        </a>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Total Clicks */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <MousePointerClick className="w-6 h-6" />
                            <h3 className="text-sm font-medium opacity-90">Total Clicks</h3>
                        </div>
                        <p className="text-4xl font-bold">{link.clicks}</p>
                    </div>

                    {/* Last Clicked */}
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-6 h-6" />
                            <h3 className="text-sm font-medium opacity-90">Last Clicked</h3>
                        </div>
                        <p className="text-xl font-semibold">
                            {link.lastClickedAt
                                ? new Date(link.lastClickedAt).toLocaleString()
                                : 'Never'}
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Short Code</span>
                            <code className="font-mono bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded">
                                {link.shortCode}
                            </code>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Created</span>
                            <span className="font-medium">
                                {new Date(link.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 dark:text-gray-400">Link ID</span>
                            <span className="font-medium">#{link.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
