'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink, Circle } from 'lucide-react';

export default function RecorderPage() {
    const recorderUrl = 'https://wcaptu.netlify.app/';

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Circle className="h-5 w-5 text-red-500" />
                    <h1 className="text-lg font-semibold">Recorder</h1>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <a href={recorderUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in new tab
                    </a>
                </Button>
            </div>
            <div className="flex-1">
                <iframe
                    src={recorderUrl}
                    className="w-full h-full border-0"
                    title="Recorder"
                    allow="camera; microphone; fullscreen; display-capture"
                />
            </div>
        </div>
    );
}
