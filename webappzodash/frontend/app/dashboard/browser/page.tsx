'use client';

import { AppWindow } from 'lucide-react';

export default function BrowserPage() {
    const browserUrl = 'https://sites.google.com/view/webappzobrowser/browser';

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <AppWindow className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Browser</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={browserUrl}
                    className="w-full h-full border-0"
                    title="Browser"
                    allow="camera; microphone; fullscreen; display-capture"
                />
            </div>
        </div>
    );
}
