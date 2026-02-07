'use client';

import { FileText } from 'lucide-react';

export function PdfView() {
    const pdfUrl = 'https://pdf-canvas-go.base44.app';

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">PDF Viewer</h1>
                </div>
            </div>
            <div className="flex-1">
                <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title="PDF Viewer"
                    allow="fullscreen; clipboard-read; clipboard-write"
                />
            </div>
        </div>
    );
}
