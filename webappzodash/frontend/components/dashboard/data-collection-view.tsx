'use client';

import { Database } from 'lucide-react';

export function DataCollectionView() {
    const dataCollectionUrl = 'https://anaw.zite.so';

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Data Collection</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={dataCollectionUrl}
                    className="w-full h-full border-0"
                    title="Data Collection"
                    allow="camera; microphone; fullscreen; display-capture; clipboard-read; clipboard-write"
                />
            </div>
        </div>
    );
}
