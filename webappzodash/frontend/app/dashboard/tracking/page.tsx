'use client';

import { BarChart3 } from 'lucide-react';

export default function TrackingPage() {
    const trackingUrl = 'https://anaw.zite.so';

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Track your website / app</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={trackingUrl}
                    className="w-full h-full border-0"
                    title="Track your website / app"
                    allow="fullscreen"
                />
            </div>
        </div>
    );
}
