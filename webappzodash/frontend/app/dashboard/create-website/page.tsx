'use client';

import { Globe } from 'lucide-react';

export default function CreateWebsitePage() {
    const createWebsiteUrl = 'https://tally.so/r/44KkdB';

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Create your website</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={createWebsiteUrl}
                    className="w-full h-full border-0"
                    title="Create your website"
                    allow="fullscreen"
                />
            </div>
        </div>
    );
}
