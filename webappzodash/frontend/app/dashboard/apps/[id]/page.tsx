'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApp } from '@/lib/api/apps';
import type { EmbeddedApp } from '@/lib/pocketbase';

export default function AppViewPage() {
    const params = useParams();
    const router = useRouter();
    const appId = params.id as string;
    const [app, setApp] = useState<EmbeddedApp | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApp();
    }, [appId]);

    const loadApp = async () => {
        const fetchedApp = await getApp(appId);
        if (!fetchedApp) {
            router.push('/dashboard/apps');
            return;
        }
        setApp(fetchedApp);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                <p>Loading...</p>
            </div>
        );
    }

    if (!app) {
        return null;
    }

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    {app.icon && <span className="text-xl">{app.icon}</span>}
                    <h1 className="text-lg font-semibold">{app.name}</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={app.url}
                    className="w-full h-full border-0"
                    title={app.name}
                    allow="camera; microphone; fullscreen; display-capture; clipboard-read; clipboard-write"
                />
            </div>
        </div>
    );
}

