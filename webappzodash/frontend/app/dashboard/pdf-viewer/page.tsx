'use client';

import { PdfView } from '@/components/dashboard/pdf-view';

export default function PdfViewerPage() {
    return (
        <div className="h-[calc(100vh-80px)]">
            <PdfView />
        </div>
    );
}
