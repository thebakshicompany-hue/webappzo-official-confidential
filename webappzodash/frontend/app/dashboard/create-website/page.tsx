'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink, Globe } from 'lucide-react';

export default function CreateWebsitePage() {
    const createWebsiteUrl = 'https://bdprobbg.fillout.com/wa';

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Create your website</h1>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <a href={createWebsiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in new tab
                    </a>
                </Button>
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
