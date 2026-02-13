'use client';

import { useState } from 'react';
import { RecorderView } from '@/components/dashboard/recorder-view';
import { BrowserView } from '@/components/dashboard/browser-view';
import { WhiteboardView } from '@/components/dashboard/whiteboard-view';
import { MeetingsView } from '@/components/dashboard/meetings-view';
import { PdfView } from '@/components/dashboard/pdf-view';
import { DataCollectionView } from '@/components/dashboard/data-collection-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Columns } from 'lucide-react';

const APPS = {
    recorder: { label: 'Recorder', component: RecorderView },
    browser: { label: 'Browser', component: BrowserView },
    whiteboard: { label: 'Whiteboard', component: WhiteboardView },
    meetings: { label: 'Meetings', component: MeetingsView },
    pdfViewer: { label: 'PDF Viewer', component: PdfView },
    dataCollection: { label: 'Data Collection', component: DataCollectionView },
};

type AppKey = keyof typeof APPS;

export default function SplitPage() {
    const [leftApp, setLeftApp] = useState<AppKey>('recorder');
    const [rightApp, setRightApp] = useState<AppKey>('browser');
    // Mobile: which panel is active (0 = left, 1 = right)
    const [activePanel, setActivePanel] = useState<0 | 1>(0);

    const LeftComponent = APPS[leftApp].component;
    const RightComponent = APPS[rightApp].component;

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            {/* Header toolbar - responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b bg-background/60 backdrop-blur-sm shrink-0 gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                    <Columns className="h-5 w-5 shrink-0" />
                    <h1 className="text-base sm:text-lg font-semibold">Split View</h1>
                </div>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Left:</span>
                        <Select value={leftApp} onValueChange={(v) => setLeftApp(v as AppKey)}>
                            <SelectTrigger className="w-full xs:w-[130px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
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
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Right:</span>
                        <Select value={rightApp} onValueChange={(v) => setRightApp(v as AppKey)}>
                            <SelectTrigger className="w-full xs:w-[130px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
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

            {/* Mobile tab switcher - only visible below md breakpoint */}
            <div className="flex md:hidden border-b shrink-0">
                <button
                    onClick={() => setActivePanel(0)}
                    className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${activePanel === 0
                            ? 'text-foreground border-b-2 border-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                >
                    {APPS[leftApp].label}
                </button>
                <button
                    onClick={() => setActivePanel(1)}
                    className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${activePanel === 1
                            ? 'text-foreground border-b-2 border-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                >
                    {APPS[rightApp].label}
                </button>
            </div>

            {/* Desktop: side-by-side layout (md and above) */}
            <div className="hidden md:flex flex-1 overflow-hidden">
                <div className="flex-1 border-r overflow-hidden relative">
                    <LeftComponent />
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <RightComponent />
                </div>
            </div>

            {/* Mobile: single panel with tab switching (below md) */}
            <div className="flex-1 md:hidden overflow-hidden relative">
                <div className={`absolute inset-0 ${activePanel === 0 ? 'block' : 'hidden'}`}>
                    <LeftComponent />
                </div>
                <div className={`absolute inset-0 ${activePanel === 1 ? 'block' : 'hidden'}`}>
                    <RightComponent />
                </div>
            </div>
        </div>
    );
}
