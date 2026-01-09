'use client';

import { PenTool } from 'lucide-react';

export function WhiteboardView() {
    const whiteboardUrl = 'https://basfwala.netlify.app/';

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Whiteboard</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={whiteboardUrl}
                    className="w-full h-full border-0"
                    title="Whiteboard"
                    allow="fullscreen"
                />
            </div>
        </div>
    );
}
