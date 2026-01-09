'use client';

import { BrowserView } from '@/components/dashboard/browser-view';

export default function BrowserPage() {
    return (
        <div className="h-[calc(100vh-80px)]">
            <BrowserView />
        </div>
    );
}
