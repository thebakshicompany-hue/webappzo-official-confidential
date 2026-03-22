'use client';

import { Settings } from 'lucide-react';
import { usePocketBaseAuth } from '@/hooks/use-pocketbase-auth';

export function ManagementView() {
    const { user, loading } = usePocketBaseAuth();
    const managementUrl = 'https://bakshi.netlify.app/';

    if (loading) return null;

    if (user?.plan !== 'max') {
        return (
            <div className="h-full flex items-center justify-center p-8 text-center">
                <div className="max-w-md space-y-4">
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">
                        You do not have access to the Management view. Please upgrade your plan to 'max' to use this feature.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-16 lg:pt-0">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Management</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={managementUrl}
                    className="w-full h-full border-0"
                    title="Management"
                    allow="fullscreen"
                />
            </div>
        </div>
    );
}
