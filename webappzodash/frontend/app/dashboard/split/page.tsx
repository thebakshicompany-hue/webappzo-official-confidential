'use client';

import { useState } from 'react';
import { RecorderView } from '@/components/dashboard/recorder-view';
import { BrowserView } from '@/components/dashboard/browser-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Columns } from 'lucide-react';

const APPS = {
    recorder: { label: 'Recorder', component: RecorderView },
    browser: { label: 'Browser', component: BrowserView },
};

type AppKey = keyof typeof APPS;

export default function SplitPage() {
    const [leftApp, setLeftApp] = useState<AppKey>('recorder');
    const [rightApp, setRightApp] = useState<AppKey>('browser');

    const LeftComponent = APPS[leftApp].component;
    const RightComponent = APPS[rightApp].component;

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                    <Columns className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Split View</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Left:</span>
                        <Select value={leftApp} onValueChange={(v) => setLeftApp(v as AppKey)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(APPS).map(([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Right:</span>
                        <Select value={rightApp} onValueChange={(v) => setRightApp(v as AppKey)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(APPS).map(([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 border-r overflow-hidden relative">
                    <LeftComponent />
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <RightComponent />
                </div>
            </div>
        </div>
    );
}
