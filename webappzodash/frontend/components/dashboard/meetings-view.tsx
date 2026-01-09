'use client';

import { Video } from 'lucide-react';

export function MeetingsView() {
    const meetingsUrl = 'https://meetings.bdpro.in';

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Meetings</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={meetingsUrl}
                    className="w-full h-full border-0"
                    title="Meetings"
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                />
            </div>
        </div>
    );
}
