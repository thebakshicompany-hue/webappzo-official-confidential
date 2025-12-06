'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApp } from '@/lib/api/apps';
import type { EmbeddedApp } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
            <div className="flex items-center justify-center h-full">
                <p>Loading...</p>
            </div>
        );
    }

    if (!app) {
        return null;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 p-4 border-b bg-background/60 backdrop-blur-sm">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/apps">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold flex items-center gap-2">
                        {app.icon && <span>{app.icon}</span>}
                        {app.name}
                    </h1>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <a href={app.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in new tab
                    </a>
                </Button>
            </div>
            <div className="flex-1">
                <iframe
                    src={app.url}
                    className="w-full h-full border-0"
                    title={app.name}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
            </div>
        </div>
    );
}
